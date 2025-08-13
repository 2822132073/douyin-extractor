export interface DouyinVideoInfo {
  title: string
  description: string
  videoUrl: string
}

export interface GeneratedCopy {
  content: string
  changes: string
  title: string
}

export class ApiServices {
  private static readonly COZE_API_BASE = "https://api.coze.cn/v1"
  private static readonly COZE_TOKEN = "sat_jFA3JGIxLC4ypDxG2hmRb8JldyRpYcJCMgnDT10xqHMiWXddxu8TewfHzJCECkmD"
  private static readonly EXTRACT_WORKFLOW_ID = "7537703267687104539"
  private static readonly GENERATE_WORKFLOW_ID = "7537539698434310182"
  private static readonly APP_ID = "7537366872477057058"

  /**
   * 抓取抖音视频信息
   */
  static async extractDouyinInfo(shareUrl: string): Promise<DouyinVideoInfo> {
    try {
      const response = await fetch(`${this.COZE_API_BASE}/workflow/stream_run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.COZE_TOKEN}`,
        },
        body: JSON.stringify({
          workflow_id: this.EXTRACT_WORKFLOW_ID,
          app_id: this.APP_ID,
          parameters: {
            input: shareUrl,
          },
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API响应错误:", response.status, errorText)
        throw new Error(`API调用失败 (${response.status}): ${errorText}`)
      }

      const responseText = await response.text()
      console.log("Coze API原始响应:", responseText)

      const lines = responseText
        .trim()
        .split("\n")
        .filter((line) => line.trim())

      let apiResult = null

      for (const line of lines) {
        try {
          const cleanLine = line.replace(/^data:\s*/, "").trim()
          if (!cleanLine || cleanLine === "[DONE]") continue

          const parsed = JSON.parse(cleanLine)
          console.log("解析的行数据:", JSON.stringify(parsed, null, 2))

          if (parsed.code === 0 && parsed.data && parsed.msg === "Success") {
            apiResult = parsed
            console.log("找到最终API结果:", apiResult)
            break
          }

          if (parsed.content && parsed.content_type === "text") {
            apiResult = { data: parsed.content }
            break
          }
        } catch (parseError) {
          console.log("跳过无法解析的行:", line)
          continue
        }
      }

      if (!apiResult || !apiResult.data) {
        console.error("未找到有效内容，完整响应:", responseText)
        throw new Error("未能从API响应中提取到有效内容")
      }

      console.log("提取到的API结果:", apiResult)

      let parsedContent: any
      try {
        parsedContent = JSON.parse(apiResult.data)
        console.log("JSON解析成功:", parsedContent)
      } catch (jsonError) {
        console.error("JSON解析失败:", jsonError)
        throw new Error("无法解析返回的数据格式")
      }

      return {
        title: parsedContent.title || "未获取到标题",
        description: parsedContent.text || "未获取到文案内容",
        videoUrl: parsedContent.url || "",
      }
    } catch (error: any) {
      console.error("API调用详细错误:", error)

      if (error.message.includes("fetch")) {
        throw new Error("网络请求失败，请检查网络连接")
      }

      throw new Error(`解析抖音链接失败: ${error.message}`)
    }
  }

  /**
   * 生成相似文案
   */
  static async generateSimilarCopies(
    originalCopy: string,
    generateCount = 3,
    userPrompt = "",
    country = "日本",
    generateWordCount = 400,
  ): Promise<GeneratedCopy[]> {
    try {
      console.log("文案生成参数:", {
        generateCount,
        userPrompt,
        country,
        generateWordCount,
        originalCopyLength: originalCopy.length,
      })

      const requestBody = {
        workflow_id: this.GENERATE_WORKFLOW_ID,
        app_id: this.APP_ID,
        parameters: {
          generate_count: generateCount,
          input: originalCopy,
          user_prompt: userPrompt,
          country: country,
          generate_word_count: generateWordCount,
        },
      }

      console.log("发送到Coze API的请求体:", JSON.stringify(requestBody, null, 2))

      const response = await fetch(`${this.COZE_API_BASE}/workflow/stream_run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.COZE_TOKEN}`,
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("文案生成API响应错误:", response.status, errorText)
        throw new Error(`文案生成API调用失败 (${response.status}): ${errorText}`)
      }

      const responseText = await response.text()
      console.log("文案生成API原始响应:", responseText)

      const lines = responseText
        .trim()
        .split("\n")
        .filter((line) => line.trim())

      let apiResult = null

      for (const line of lines) {
        try {
          const cleanLine = line.replace(/^data:\s*/, "").trim()
          if (!cleanLine || cleanLine === "[DONE]") continue

          const parsed = JSON.parse(cleanLine)
          console.log("解析的文案生成行数据:", JSON.stringify(parsed, null, 2))

          if (parsed.code === 0 && parsed.data && parsed.msg === "Success") {
            apiResult = parsed
            console.log("找到文案生成最终结果:", apiResult)
            break
          }

          if (parsed.content && parsed.content_type === "text") {
            apiResult = { data: parsed.content }
            break
          }
        } catch (parseError) {
          console.log("跳过无法解析的文案生成行:", line)
          continue
        }
      }

      if (!apiResult || !apiResult.data) {
        console.error("未找到有效的文案生成内容，完整响应:", responseText)
        throw new Error("未能从API响应中提取到有效的文案生成内容")
      }

      // 解析返回的数据
      let parsedData: any
      try {
        parsedData = JSON.parse(apiResult.data)
        console.log("文案生成JSON解析成功:", parsedData)
      } catch (parseError) {
        console.error("解析文案生成数据失败:", parseError)
        throw new Error("无法解析文案生成结果")
      }

      if (!parsedData.items || !Array.isArray(parsedData.items)) {
        throw new Error("文案生成结果格式不正确")
      }

      // 转换为前端需要的格式
      return parsedData.items.map((item: any) => ({
        content: item.text || "",
        changes: item.modify_item || "",
        title: item.title || "",
      }))
    } catch (error: any) {
      console.error("文案生成详细错误:", error)
      throw new Error(`生成相似文案失败: ${error.message}`)
    }
  }
}
