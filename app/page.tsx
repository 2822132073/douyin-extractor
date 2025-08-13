"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Video, Copy, ExternalLink, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface VideoInfo {
  title: string
  description: string
  videoUrl: string
}

interface GeneratedCopy {
  content: string
  changes: string
  title: string
}

// 模拟数据
const mockVideoInfo: VideoInfo = {
  title: "夏日海滩度假vlog | 阳光沙滩海浪",
  description: "在三亚的这片海滩真是太美了！金色的沙滩、清澈的海水、温暖的阳光，还有轻柔的海风。在这里度过了一个完美的下午，忘却了城市的喧嚣。推荐大家来体验一下这份宁静与美好。#夏日海滩 #度假胜地 #放松心情",
  videoUrl: "https://example.com/video.mp4"
}

const mockGeneratedCopies: GeneratedCopy[] = [
  {
    title: "清新文艺风",
    content: "三亚的海滩，如诗如画。细腻的沙粒在脚趾间轻柔滑过，碧蓝的海水轻抚着海岸。阳光洒在身上，温暖而舒适，海风带着淡淡的咸味。在这里，时间仿佛静止，心灵得到了彻底的放松。远离城市的喧嚣，享受这份难得的宁静与美好。",
    changes: "将原文的直白描述转换为更具诗意的表达，使用了更多形容词和比喻手法，营造出清新文艺的氛围。"
  },
  {
    title: "活泼社交风",
    content: "朋友们，你们绝对不能错过三亚这片宝藏海滩！🏖️ 金色沙滩+清澈海水+温暖阳光+轻柔海风=完美下午！在这里，我完全忘记了工作的烦恼，身心都得到了放松。强烈推荐大家来打卡！#夏日海滩 #度假天堂 #放松心情 #必去景点",
    changes: "增加了更多表情符号和标签，语言更加活泼，使用了社交网络常用的表达方式，增强了互动性。"
  },
  {
    title: "正式宣传风",
    content: "三亚优质海滩，自然风光旖旎。拥有细腻沙滩、清澈海水、充足阳光和宜人海风。是远离城市喧嚣、放松身心的理想场所。在此可享受宁静时光，体验自然之美，是度假休闲的绝佳选择。欢迎前来体验这份独特的宁静与美好。",
    changes: "将口语化表达转换为正式的书面语，使用了更加规范的词汇和句式，适合用于宣传材料。"
  }
]

export default function DouyinExtractor() {
  const [shareUrl, setShareUrl] = useState("")
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [generatedCopies, setGeneratedCopies] = useState<GeneratedCopy[]>([])
  const [generatingCopies, setGeneratingCopies] = useState(false)
  const [generateCount, setGenerateCount] = useState("3")
  const [userPrompt, setUserPrompt] = useState("")
  const [targetCountry, setTargetCountry] = useState("日本")
  const [wordCount, setWordCount] = useState("400")
  const { toast } = useToast()

  const handleExtract = async () => {
    if (!shareUrl.trim()) {
      toast({
        title: "错误",
        description: "请输入抖音分享链接",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 使用模拟数据
    setVideoInfo(mockVideoInfo)
    setGeneratedCopies([])
    
    toast({
      title: "成功",
      description: "视频信息抓取成功！",
    })
    
    setLoading(false)
  }

  const handleGenerateSimilarCopies = async () => {
    if (!videoInfo?.description) {
      toast({
        title: "错误",
        description: "没有可用的原始文案",
        variant: "destructive",
      })
      return
    }

    setGeneratingCopies(true)
    setGeneratedCopies([])

    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 使用模拟数据
    setGeneratedCopies(mockGeneratedCopies)

    toast({
      title: "成功",
      description: `AI文案生成成功！共生成${mockGeneratedCopies.length}个文案变体`,
    })
    
    setGeneratingCopies(false)
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text)
        toast({
          title: "✅ 复制成功",
          description: `${type}已复制到剪贴板`,
          duration: 2000,
        })
      } else {
        const textArea = document.createElement("textarea")
        textArea.value = text
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)

        toast({
          title: "✅ 复制成功",
          description: `${type}已复制到剪贴板`,
          duration: 2000,
        })
      }
    } catch (error) {
      toast({
        title: "❌ 复制失败",
        description: "无法复制到剪贴板，请手动复制",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const openVideoUrl = (url: string) => {
    if (typeof window !== "undefined") {
      window.open(url, "_blank")
    }
  }

  const getWordCount = (text: string) => {
    return text.length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Video className="h-8 w-8 text-pink-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              抖音视频信息抓取 & AI文案生成器
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">输入抖音分享链接，获取视频信息并AI生成创意文案变体</p>
        </div>

        {/* Input Section */}
        <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              输入分享链接
            </CardTitle>
            <CardDescription>粘贴从抖音APP复制的分享链接</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shareUrl">抖音分享链接</Label>
              <Input
                id="shareUrl"
                placeholder="例如: https://v.douyin.com/xxxxxxx/ 或完整链接"
                value={shareUrl}
                onChange={(e) => setShareUrl(e.target.value)}
                className="text-base"
              />
            </div>
            <Button
              onClick={handleExtract}
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  正在抓取...
                </>
              ) : (
                "开始抓取"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {videoInfo && (
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-600 dark:text-green-400">抓取结果</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">视频标题</Label>
                <div className="flex items-center gap-2">
                  <Input value={videoInfo.title} readOnly className="flex-1" />
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(videoInfo.title, "标题")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">视频文案</Label>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                    {getWordCount(videoInfo.description)}字
                  </span>
                </div>
                <div className="flex gap-2">
                  <Textarea value={videoInfo.description} readOnly className="flex-1 min-h-[100px]" />
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(videoInfo.description, "文案")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Video URL */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">视频下载链接</Label>
                <div className="flex gap-2">
                  <Input value={videoInfo.videoUrl} readOnly className="flex-1" />
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(videoInfo.videoUrl, "下载链接")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openVideoUrl(videoInfo.videoUrl)}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <Label className="text-sm font-medium text-blue-600 dark:text-blue-400">AI文案生成配置</Label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">生成数量</Label>
                    <Select value={generateCount} onValueChange={setGenerateCount}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择生成数量" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1个文案</SelectItem>
                        <SelectItem value="2">2个文案</SelectItem>
                        <SelectItem value="3">3个文案</SelectItem>
                        <SelectItem value="4">4个文案</SelectItem>
                        <SelectItem value="5">5个文案</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">目标国家</Label>
                    <Select value={targetCountry} onValueChange={setTargetCountry}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择目标国家" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="日本">日本</SelectItem>
                        <SelectItem value="韩国">韩国</SelectItem>
                        <SelectItem value="美国">美国</SelectItem>
                        <SelectItem value="加拿大">加拿大</SelectItem>
                        <SelectItem value="澳大利亚">澳大利亚</SelectItem>
                        <SelectItem value="新西兰">新西兰</SelectItem>
                        <SelectItem value="英国">英国</SelectItem>
                        <SelectItem value="德国">德国</SelectItem>
                        <SelectItem value="法国">法国</SelectItem>
                        <SelectItem value="意大利">意大利</SelectItem>
                        <SelectItem value="西班牙">西班牙</SelectItem>
                        <SelectItem value="荷兰">荷兰</SelectItem>
                        <SelectItem value="瑞士">瑞士</SelectItem>
                        <SelectItem value="新加坡">新加坡</SelectItem>
                        <SelectItem value="马来西亚">马来西亚</SelectItem>
                        <SelectItem value="泰国">泰国</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">字数限制</Label>
                    <Select value={wordCount} onValueChange={setWordCount}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择字数限制" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="200">200字</SelectItem>
                        <SelectItem value="300">300字</SelectItem>
                        <SelectItem value="400">400字</SelectItem>
                        <SelectItem value="500">500字</SelectItem>
                        <SelectItem value="600">600字</SelectItem>
                        <SelectItem value="800">800字</SelectItem>
                        <SelectItem value="1000">1000字</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">自定义提示（可选）</Label>
                  <Textarea
                    placeholder="例如：更加幽默、更正式、突出优势等&#10;可以输入多行详细的风格要求和创作指导"
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    className="min-h-[80px] resize-y"
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleGenerateSimilarCopies}
                  disabled={generatingCopies}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  size="lg"
                >
                  {generatingCopies ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      正在生成{generateCount}个文案...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      AI生成{generateCount}个相似文案
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {generatedCopies.length > 0 && (
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Sparkles className="h-5 w-5" />
                AI生成的相似文案 ({generatedCopies.length}个)
              </CardTitle>
              <CardDescription>基于原文案生成的创意变体，每个文案都包含详细的修改说明</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {generatedCopies.map((copyData, index) => (
                <div
                  key={index}
                  className="space-y-3 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border border-blue-100 dark:border-blue-800"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <Label className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                          文案 {index + 1}
                        </Label>
                        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
                          {getWordCount(copyData.content)}字
                        </span>
                      </div>
                      {copyData.title && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{copyData.title}</p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(copyData.content, `文案 ${index + 1}`)}
                      className="border-blue-200 hover:bg-blue-100 dark:border-blue-700 dark:hover:bg-blue-900"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  <Textarea
                    value={copyData.content}
                    readOnly
                    className="min-h-[80px] bg-white/70 dark:bg-gray-800/70 border-blue-200 dark:border-blue-700"
                  />

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <Label className="text-xs font-medium text-blue-600 dark:text-blue-400">修改说明</Label>
                    </div>
                    <p className="text-sm text-muted-foreground bg-white/50 dark:bg-gray-800/50 p-3 rounded border border-blue-100 dark:border-blue-800 leading-relaxed">
                      {copyData.changes}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Usage Tips */}
        <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-sm">使用说明</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>• 支持抖音短链接和完整链接格式</p>
            <p>• 点击复制按钮可快速复制内容到剪贴板</p>
            <p>• 视频链接可直接用于下载或在浏览器中播放</p>
            <p>• 可自定义生成文案数量（1-5个）和风格提示</p>
            <p>• AI生成的文案包含详细修改说明，帮助理解创作思路</p>
            <p>• 请遵守相关法律法规，仅用于个人学习和研究</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
