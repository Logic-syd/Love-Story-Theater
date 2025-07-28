// src/lib/conversationContent.ts

type FormDataKey =
  | "name"
  | "meetingContext"
  | "memories"
  | "appearance"
  | "work"
  | "personality"
  | "problem";

interface Question {
  key: FormDataKey;
  texts: string[];
}

interface LanguagePack {
  nameQuestion: Question;
  poolA: Question[];
  poolB: Question[];
  problemQuestion: Question;
  dynamicInteraction: {
    loadingText: string;
    fallbackQuestion: string[]; // <---  改成数组
  };
  finalAcknowledgement: {
    texts: string[]; // <---  改成数组
  };
  buttons: {
    regenerate: string;
    reset: string;
  };
}

export const content: Record<string, LanguagePack> = {
  zh: {
    // ... (nameQuestion, poolA, poolB, problemQuestion 保持不变)
    nameQuestion: {
      key: "name",
      texts: [
        "亲爱的，最近还好吗？我们慢慢聊。你心里念着的那个他，叫什么名字呀？",
        "宝贝，今天过得怎么样？可以告诉我那个让你挂心的他的名字吗？",
        "你好呀，朋友。可以和我聊聊那个让你思绪万千的TA的名字吗？",
      ],
    },
    poolA: [
      {
        key: "meetingContext",
        texts: [
          "你们是怎么认识的呀？一定很有趣吧！",
          "真想听听你们相遇的故事，快跟我讲讲！",
          "可以分享一下你们邂逅的瞬间吗？",
        ],
      },
      {
        key: "memories",
        texts: [
          "你们之间有什么让你记忆特别深刻的事吗？",
          "可以分享一个关于你们的美好回忆吗？",
          "告诉我一件和他之间，让你一想起来就忍不住微笑的事吧。",
        ],
      },
    ],
    poolB: [
      {
        key: "appearance",
        texts: [
          "嗯嗯，我有点好奇，可以跟我形容一下他的样子吗？",
          "他一定很特别吧，可以给我描述一下他的外貌吗？",
          "我在脑海里构思他的样子啦，快给我一些外貌的线索吧！",
        ],
      },
      {
        key: "work",
        texts: ["那他是做什么工作的呢？", "可以告诉我他的职业吗？"],
      },
      {
        key: "personality",
        texts: [
          "听起来很有画面感了！那相处下来，你觉得他最吸引你的性格是什么？",
          "他的性格怎么样？跟我聊聊吧。",
          "可以多告诉我一些TA的性格吗？比如温柔、幽默之类的。",
        ],
      },
    ],
    problemQuestion: {
      key: "problem",
      texts: [
        "谢谢你告诉我这么多。最后，可以跟我说说最近让你困扰或委屈的事吗？",
        "他最近怎么让你难过了",
        "最近你收到什么委屈了吗？",
      ],
    },

    dynamicInteraction: {
      loadingText: "嗯...让我想想...",
      // VVV 改成数组 VVV
      fallbackQuestion: [
        "听起来你们的故事很美好。接下来，可以跟我形容一下他的样子吗？",
        "真好～那我们继续聊聊他吧，他外表给人的感觉是怎样的？",
      ],
    },
    finalAcknowledgement: {
      // VVV 改成数组 VVV
      texts: [
        "谢谢你的倾诉...请把剩下的交给我，我会把你的心情编织成一个温暖的故事来给你力量。",
        "收到了，宝贝。谢谢你愿意相信我。让我为你构想一个充满希望的未来吧...",
        "我完全理解你的感受。别怕，我们一起来看看故事会怎样发生……",
      ],
    },
    buttons: {
      regenerate: "换一个梦境",
      reset: "开启新对话",
    },
  },
  // en 和 de 部分也需要做对应修改...
};
