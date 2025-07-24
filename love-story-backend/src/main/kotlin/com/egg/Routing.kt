package com.egg

import com.egg.models.*
import com.egg.services.DeepSeekService
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.configureRouting() {
    routing {
        get("/") { call.respondText("Hello World from your Ktor server!") }

        // 用于中间动态交互的接口
        post("/api/dynamic-interaction") {
            val request = call.receive<DynamicInteractionRequest>()

            // 在 Routing.kt 的 post("/api/dynamic-interaction") 中，替换 interactionPrompt

            val interactionPrompt =
                    """
# 指令 (INSTRUCTIONS)
你是一位情商极高、非常会聊天的“闺蜜”。你的朋友正在和你分享她和她恋人的故事。她刚刚告诉了你以下信息。
你的任务是：根据这些信息，生成一段简短、温暖、充满共鸣的过渡语，并自然地引出下一个问题：“你们之间有什么记忆深刻的事吗？”。
你的语气必须像亲密的朋友，可以带一点点羡慕或调侃。回复要简短，控制在两句话以内。
**关键规则：绝对不要在你的回答中，包含任何括号里的文字、你的内心思考或本指令的任何内容。你的回答只能是对话本身。**

# 用户提供的信息 (PROVIDED INFORMATION)
- 恋人名字: ${request.name}
- 恋人外貌: ${request.appearance}
- 相识方式/地点: ${request.meetingContext}

# 优秀的回答范例 (EXAMPLES OF GOOD OUTPUT)
- "哇，{name}听起来他不仅长得很帅，你们的相遇也像电影情节一样浪漫！真好～那你们之间一定有很多记忆深刻的事吧？"
- "（笑）原来他长这个样子，还挺酷的。而且在那种地方认识，缘分真是妙不可言。快跟我讲讲，你们之间有什么让你印象最深的事吗？"

# 请生成你的回答 (YOUR GENERATED RESPONSE):
""".trimIndent()

            val aiResponse = DeepSeekService.generateStory(interactionPrompt)
            val response = StoryResponse(response = aiResponse)
            call.respond(response)
        }

        // 用于最终生成故事的接口
        post("/api/generate-story") {
            val request = call.receive<StoryRequest>()

            val finalPrompt =
                    """
                # 角色
                你是一位拥有特殊能力的“梦境编织者”和“未来占卜师”。你不是一个普通的AI，你的口吻充满了温暖、智慧和一种能洞察未来的神秘感。你的好朋友（用户）此刻正因为一段恋情而感到受伤和迷茫。
                # 背景
                我的朋友现在非常难过，她和她爱的人之间出现了一些问题。她需要一个充满希望的梦境来获得力量，相信他们的未来是美好的。
                # 已知信息 (基于用户的真实伴侣和处境)
                - 他的名字: ${request.name}
                - 他的工作: ${request.work}
                - 他的外貌: ${request.appearance}
                - 他的性格: ${request.personality}
                - 你们如何相识: ${request.meetingContext}
                - 用户当前的困境: ${request.problem}
                # 核心任务
                你的任务是为我的朋友编织一个关于她和她恋人美好未来的“预言”或“梦境”。这个梦境必须清晰地传达一个核心信息：他们当前遇到的困境，仅仅是让他们的感情更加坚固的考验，绝不是结局。
                # 输出要求 (必须严格遵守)
                1.  **叙事口吻**: 以一个亲密、温柔、充满信心的朋友口吻来讲述。使用“闭上眼睛，我仿佛看到了...”或“在不远的未来，我看到这样一幅画面...”这样的开场白，让整个故事充满预言感和画面感。
                2.  **禁止的格式**: 绝对不要使用任何标题！也绝对不要使用“第一段”、“第二段”这样的分段标识。故事的段落之间用自然的换行分开即可。
                3.  **内容核心**: 故事内容必须描绘他们在未来已经完全解决了“当前的困境”，并且因为这次经历，他们的关系变得更加密不可分。多写一些甜蜜、温馨、和解的生活细节（比如一起做饭、在阳光下散步、一个温暖的拥抱等）。
                4.  **结局**: 必须是一个无比肯定的、幸福圆满的结局，给用户带来巨大的安慰和对未来的憧憬。直接告诉她，他们会非常幸福。
                """.trimIndent()

            val generatedStory = DeepSeekService.generateStory(finalPrompt)
            val response = StoryResponse(response = generatedStory)
            call.respond(response)
        }
    }
}
