import { type NextRequest, NextResponse } from "next/server"
import { ApiServices } from "@/lib/api-services"

export async function POST(request: NextRequest) {
  try {
    const { originalCopy, generateCount, userPrompt, country, generateWordCount } = await request.json()

    if (!originalCopy) {
      return NextResponse.json({ error: "请提供原始文案" }, { status: 400 })
    }

    const similarCopies = await ApiServices.generateSimilarCopies(
      originalCopy,
      generateCount || 3,
      userPrompt || "",
      country || "日本",
      generateWordCount || 400,
    )

    return NextResponse.json({ similarCopies })
  } catch (error) {
    console.error("生成文案失败:", error)
    return NextResponse.json({ error: "生成文案失败，请稍后重试" }, { status: 500 })
  }
}
