import { Layout } from "@/components/layout/Layout"

export default function ProfilePage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Hồ sơ cá nhân</h1>
        <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
          <h2 className="text-xl mb-4">👤 Trang đang được phát triển</h2>
          <p className="text-gray-600">
            Tính năng quản lý hồ sơ cá nhân sẽ được cập nhật sớm.
          </p>
        </div>
      </div>
    </Layout>
  )
}
