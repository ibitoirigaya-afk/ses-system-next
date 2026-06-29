import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow">
        <p className="text-sm font-semibold text-blue-600">
          SES/BP Sales Management System
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          SES/BP営業管理システム
        </h1>

        <p className="mt-4 text-slate-600">
          Next.js App Router、Server Components、Server Actions、Prisma、Auth.js
          を使って構築するフルスタック版のSES/BP営業管理システムです。
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 p-4">
            <h2 className="font-bold text-slate-900">画面表示</h2>
            <p className="mt-2 text-sm text-slate-600">Server Components</p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <h2 className="font-bold text-slate-900">登録・更新・削除</h2>
            <p className="mt-2 text-sm text-slate-600">Server Actions</p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <h2 className="font-bold text-slate-900">DB操作</h2>
            <p className="mt-2 text-sm text-slate-600">
              Prisma + repository層
            </p>
          </div>
        </div>

        <Link
          href="/login"
          className="mt-8 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
        >
          ログインへ進む
        </Link>
      </div>
    </main>
  );
}