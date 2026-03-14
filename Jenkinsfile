@Library('anhnt-jenkins-library@master') _

def gv
def buildUrl
def envIcon
def envName

pipeline {
    agent any 

    parameters {
        string(name: 'MANUAL_BRANCH_NAME', defaultValue: env.BRANCH_NAME ?: "main", description: 'Branch to build manually')
        booleanParam(name: 'ONLY_DEPLOY', defaultValue: false, description: 'Only deploy without building')
        string(name: 'MANUAL_VERSION_TAG', description: 'Version tag to deploy manually')
    }

    environment {
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_NAMESPACE = 'cpc1hn'
        DOCKER_CREDS_ID = 'docker-cpc1hn'
        APP_NAME = 'c-online'

        SLACK_CHANNEL = 'ci-cd'

        STAGING_DIR = '/srv/web-staging/c-online'
        TEST_DIR = '/srv/web-test/c-online'
    }

    stages {
        stage('Init') {
            steps {
                script {
                    gv = load 'script.groovy'

                    env.DEPLOY_ENV = gv.getDeploymentEnvironment()
                    echo "Deployment environment set to: ${env.DEPLOY_ENV}"

                    if (env.DEPLOY_ENV == 'other') {
                        error "Skipping pipeline: Unsupported deployment environment '${env.DEPLOY_ENV}'."
                    }

                    env.DOCKER_VERSION_TAG = generateDockerTag()

                    if (env.DEPLOY_ENV == 'test'){
                        env.APP_NAME = "${env.APP_NAME}-test"
                        env.DOCKER_VERSION_TAG = "test"
                    }

                    envIcon = getEnvIcon(env.DEPLOY_ENV)
                    envName = env.DEPLOY_ENV.capitalize()
                    buildUrl = "<${env.BUILD_URL}pipeline-console/|#${env.BUILD_NUMBER}>"
                    def commitMessage = getCommitMessage()

                    sendSlackNotification(
                        "#FFFF00", 
                        "${envIcon} *[${envName}]* *${env.APP_NAME}*: Deployment started ${buildUrl}",
                        "• Branch: ${env.BRANCH_NAME ?: params.MANUAL_BRANCH_NAME} - Tag: ${env.DOCKER_VERSION_TAG}\n• Commit: ${commitMessage}"
                    )
                }
            }
        }

        stage('Checkout') {
            steps {
                script {
                    checkoutGithub()
                }
            }
        }

        stage('Test') {
            when {
                expression { !params.ONLY_DEPLOY }
            }
            steps {
                sh "npm ci || npm install" 
                sh "npm run lint"
            }
        }

        stage('Build & Push') {
            when {
                expression { !params.ONLY_DEPLOY }
            }
            steps {
                script {
                    gv.buildDockerImage()
                    gv.pushDockerImage(env.DOCKER_VERSION_TAG)
                }
            }
        }

        stage('Deploy') {
             when {
                expression { env.DEPLOY_ENV == 'staging' || env.DEPLOY_ENV == 'test' }
            }
            steps {
                script {
                    def dockerVersionTag = params.MANUAL_VERSION_TAG ?: env.DOCKER_VERSION_TAG
                    echo "Deploying to ${env.DEPLOY_ENV} with version: ${dockerVersionTag}"
                    gv.deployToTestOrStaging(env.DEPLOY_ENV, dockerVersionTag)
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
        success {
            script {
                def url = env.DEPLOY_ENV == 'staging' ? "https://c-online-staging.dtp-dev.site" : "https://c-online-test.dtp-dev.site"
                sendSlackNotification(
                    "#36a64f", 
                    "${envIcon} *[${envName}]* *${env.APP_NAME}*: Successfully deployed ${buildUrl}",
                    "• Duration: ${currentBuild.durationString} - Url: ${url}"
                )
            }
        }
        unstable {
            script {
                 sendSlackNotification(
                    "#FFA500", 
                    "${envIcon} *[${envName}]* *${env.APP_NAME}*: Unstable deployment ${buildUrl}",
                    ""
                )
            }
        }
        failure {
            script {
                sendSlackNotification(
                    "#FF0000", 
                    "${envIcon} *[${envName}]* *${env.APP_NAME}*: Failed to deploy ${buildUrl}",
                    ""
                )
            }
        }
    }
}
