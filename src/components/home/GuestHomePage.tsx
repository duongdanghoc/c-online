import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Clock } from "lucide-react";

export default function GuestHomePage() {
  return (
    <div className="w-full flex flex-col bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-800 to-blue-700">
        <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-10" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/20 text-blue-50 backdrop-blur-md border border-blue-200/20 mb-6 animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-blue-400" />
            <span className="text-sm font-medium tracking-wide text-white">
              Nền tảng Dược phẩm Trực tuyến Hàng đầu
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight max-w-4xl leading-tight mb-8">
            Chăm sóc sức khỏe gia đình với sản phẩm <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-blue-200">CPC1HN</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mb-10 font-light">
            Mua sắm các sản phẩm dược phẩm chính hãng, chất lượng cao, an toàn và hiệu quả. Đăng nhập ngay để khám phá các ưu đãi đặc quyền dành riêng cho bạn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ring-4 ring-white/20"
            >
              Đăng nhập ngay
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/category"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300"
            >
              Tìm hiểu sản phẩm
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Vì sao chọn CPC1 Hà Nội?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Chúng tôi cam kết mang đến sự chăm sóc sức khỏe tốt nhất với tiêu chuẩn an toàn hiện đại.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="group p-8 rounded-3xl bg-slate-50 hover:bg-blue-50 transition-colors duration-300 border border-slate-100 hover:border-blue-100 shadow-sm hover:shadow-md">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Sản phẩm chính hãng</h3>
              <p className="text-slate-600 leading-relaxed">
                Tất cả sản phẩm dược phẩm đạt tiêu chuẩn an toàn quốc tế, đảm bảo nguồn gốc xuất xứ rõ ràng.
              </p>
            </div>
            
            <div className="group p-8 rounded-3xl bg-slate-50 hover:bg-teal-50 transition-colors duration-300 border border-slate-100 hover:border-teal-100 shadow-sm hover:shadow-md">
              <div className="w-14 h-14 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Giao hàng nhanh chóng</h3>
              <p className="text-slate-600 leading-relaxed">
                Hệ thống giao hàng phủ rộng toàn quốc, đảm bảo thuốc và sản phẩm y tế được chuyển tới tận tay bạn sớm nhất.
              </p>
            </div>
            
            <div className="group p-8 rounded-3xl bg-slate-50 hover:bg-indigo-50 transition-colors duration-300 border border-slate-100 hover:border-indigo-100 shadow-sm hover:shadow-md">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Hỗ trợ nhanh 24/7</h3>
              <p className="text-slate-600 leading-relaxed">
                Đội ngũ dược sĩ và chuyên gia luôn túc trực để tư vấn sức khỏe, hướng dẫn dùng thuốc cho bạn trọn vẹn.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/noise-QyFfB0bNtb0p8F9GzU1WvK0P7R4Nf1.png')] opacity-10 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Sẵn sàng trải nghiệm dịch vụ?</h2>
          <p className="text-slate-300 text-lg mb-10">Đăng nhập tài khoản để nhận được hỗ trợ tận tình, quản lý đơn hàng chuyên nghiệp và hưởng các chính sách ưu đãi.</p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 bg-teal-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-teal-400 hover:shadow-xl hover:shadow-teal-500/20 transition-all duration-300"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </section>
    </div>
  );
}
