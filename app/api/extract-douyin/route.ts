import { type NextRequest, NextResponse } from "next/server"
import { ApiServices } from "@/lib/api-services"

export async function POST(request: NextRequest) {
  try {
    const { shareUrl } = await request.json()

    if (!shareUrl) {
      return NextResponse.json({ error: "请提供分享链接" }, { status: 400 })
    }

    const videoInfo = await ApiServices.extractDouyinInfo(shareUrl)

    return NextResponse.json(videoInfo)
  } catch (error) {
    console.error("抖音信息抓取失败:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "抓取失败，请检查链接是否正确",
      },
      { status: 500 },
    )
  }
}
