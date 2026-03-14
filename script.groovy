def buildDockerImage() {
  echo "Building Docker image with version: ${env.DOCKER_VERSION_TAG}"
  def dockerArgs = "--build-arg VERSION=${env.DOCKER_VERSION_TAG} -t ${DOCKER_NAMESPACE}/${APP_NAME}:${env.DOCKER_VERSION_TAG}"
  if (env.DEPLOY_ENV != 'test') {
    dockerArgs += " -t ${DOCKER_NAMESPACE}/${APP_NAME}:latest"
  }
  sh "docker build ${dockerArgs} ."
}

def pushDockerImage(String versionTag) {
  withCredentials([usernamePassword(credentialsId: env.DOCKER_CREDS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
    echo "Pushing Docker images to ${env.DOCKER_REGISTRY}"
    sh "echo $DOCKER_PASS | docker login ${env.DOCKER_REGISTRY} -u $DOCKER_USER --password-stdin"
    sh "docker push ${env.DOCKER_NAMESPACE}/${env.APP_NAME}:${versionTag}"
    if (env.DEPLOY_ENV != 'test') {
      sh "docker push ${env.DOCKER_NAMESPACE}/${env.APP_NAME}:latest"
    }            
    sh "docker logout ${env.DOCKER_REGISTRY}"
  }
}


def deployToTestOrStaging(String environment, String version) {
  echo "Starting ${environment} deployment process for version: ${version}"
  
  timeout(time: 15, unit: 'MINUTES') {
    def remote_dir = environment == 'staging' ? env.STAGING_DIR : env.TEST_DIR
    def sshConfig = generateSshConfig('serverai-ts')
    
    // Prepare deployment files
    sh "mkdir -p deploy"
    def composeFile = environment == 'staging' ? 'docker-compose.staging.yml' : 'docker-compose.test.yml'
    sh "cp ${composeFile} deploy/docker-compose.yml"
    
    // Update version in docker-compose.yml to ensure correct image is deployed
    sh "sed -i -e 's/APP_VERSION/${version}/g' deploy/docker-compose.yml" 

    try {
      sshagent(credentials: [sshConfig.credentialsId]) {
        writeFile file: 'deploy/ssh_config', text: sshConfig.config

        sh "ssh -F deploy/ssh_config deploy-target 'mkdir -p ${remote_dir}'"
        sh "scp -F deploy/ssh_config -r deploy/* deploy-target:${remote_dir}/"

        // Execute deployment on server
        sh "ssh -F deploy/ssh_config deploy-target 'cd ${remote_dir} && sudo /usr/local/bin/deploy_docker.sh ${env.APP_NAME}-${environment}'"
      }
      
      echo "Deployment to ${environment} completed successfully!"
    } catch (Exception e) {
      echo "Deployment failed: ${e.message}"
      throw e
    } finally {
      sh "rm -rf deploy"
    }
  }
  
  echo "Production deployment process completed for version ${version}"
}

return this
