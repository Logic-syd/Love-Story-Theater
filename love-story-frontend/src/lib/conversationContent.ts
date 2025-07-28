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

// Add all UI text to the language pack
interface LanguagePack {
  appTitle: string;
  inputPlaceholder: string;
  copySuccessMessage: string;
  nameQuestion: Question;
  poolA: Question[];
  poolB: Question[];
  problemQuestion: Question;
  dynamicInteraction: {
    loadingText: string;
    fallbackQuestion: string[];
  };
  finalAcknowledgement: {
    texts: string[];
  };
  buttons: {
    regenerate: string;
    reset: string;
  };
}

export const content: Record<string, LanguagePack> = {
  // --- Chinese Content ---
  zh: {
    appTitle: "风月宝鉴",
    inputPlaceholder: "请输入你的回答...",
    copySuccessMessage: "故事已复制到剪贴板！",
    nameQuestion: {
      key: "name",
      texts: [
        "亲爱的，最近还好吗？我们慢慢聊。你心里念着的那个他，叫什么名字呀？",
        "宝贝，今天过得怎么样？可以告诉我那个让你挂心的他的名字吗？",
      ],
    },
    poolA: [
      {
        key: "meetingContext",
        texts: [
          "你们是怎么认识的呀？一定很有趣吧！",
          "真想听听你们相遇的故事，快跟我讲讲！",
        ],
      },
      {
        key: "memories",
        texts: [
          "你们之间有什么让你记忆特别深刻的事吗？",
          "可以分享一个关于你们的美好回忆吗？",
        ],
      },
    ],
    poolB: [
      {
        key: "appearance",
        texts: [
          "嗯嗯，我有点好奇，可以跟我形容一下他的样子吗？",
          "他一定很特别吧，可以给我描述一下他的外貌吗？",
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
        ],
      },
    ],
    problemQuestion: {
      key: "problem",
      texts: [
        "谢谢你告诉我这么多。最后，可以跟我说说最近让你困扰或委屈的事吗？",
      ],
    },
    dynamicInteraction: {
      loadingText: "嗯...让我想想...",
      fallbackQuestion: [
        "听起来你们的故事很美好。接下来，可以跟我形容一下他的样子吗？",
        "真好～那我们继续聊聊他吧，他外表给人的感觉是怎样的？",
      ],
    },
    finalAcknowledgement: {
      texts: [
        "谢谢你的倾诉...请把剩下的交给我，我会把你的心情编织成一个温暖的故事来给你力量。",
        "收到了，宝贝。谢谢你愿意相信我。让我为你构想一个充满希望的未来吧...",
      ],
    },
    buttons: { regenerate: "换一个梦境", reset: "开启新对话" },
  },

  // --- English Content (Now Complete) ---
  en: {
    appTitle: "Your Emotional Comfort Cabin",
    inputPlaceholder: "Type your answer...",
    copySuccessMessage: "Story copied to clipboard!",
    nameQuestion: {
      key: "name",
      texts: [
        "Hey dear, how are you? Let's talk. What's the name of the person on your mind?",
        "Hi there. How's your day been? Can you tell me the name of him who's been occupying your thoughts?",
      ],
    },
    poolA: [
      {
        key: "meetingContext",
        texts: ["How did you two meet? It must be an interesting story!"],
      },
      {
        key: "memories",
        texts: ["What's a memory with them that really stands out to you?"],
      },
    ],
    poolB: [
      {
        key: "appearance",
        texts: ["I'm curious, can you describe what he looks like?"],
      },
      { key: "work", texts: ["What does he do for work?"] },
      {
        key: "personality",
        texts: ["What's his personality like? Tell me about it."],
      },
    ],
    problemQuestion: {
      key: "problem",
      texts: [
        "Thank you for sharing so much. Lastly, can you tell me what has been troubling or upsetting you lately?",
      ],
    },
    dynamicInteraction: {
      loadingText: "Hmm... let me think...",
      fallbackQuestion: [
        "It sounds like you have a wonderful story. Next, can you describe his appearance for me?",
      ],
    },
    finalAcknowledgement: {
      texts: [
        "Thank you for sharing... Leave the rest to me. I will weave your feelings into a warm story to give you strength.",
      ],
    },
    buttons: { regenerate: "Another Dream", reset: "New Conversation" },
  },

  // --- German Content (Now Complete) ---
  de: {
    appTitle: "Deine emotionale Trosthütte",
    inputPlaceholder: "Gib deine Antwort ein...",
    copySuccessMessage: "Geschichte in die Zwischenablage kopiert!",
    nameQuestion: {
      key: "name",
      texts: [
        "Hallo, wie geht es dir? Lass uns reden. Wie heißt die Person, an die du denkst?",
        "Hallo. Wie war dein Tag? Kannst du mir den Namen desjenigen verraten, der deine Gedanken beschäftigt?",
      ],
    },
    poolA: [
      {
        key: "meetingContext",
        texts: [
          "Wie habt ihr euch kennengelernt? Das ist sicher eine interessante Geschichte!",
        ],
      },
      {
        key: "memories",
        texts: ["Was ist eine besondere Erinnerung, die du mit ihm hast?"],
      },
    ],
    poolB: [
      {
        key: "appearance",
        texts: [
          "Ich bin neugierig, kannst du mir beschreiben, wie er aussieht?",
        ],
      },
      { key: "work", texts: ["Was macht er beruflich?"] },
      {
        key: "personality",
        texts: ["Wie ist seine Persönlichkeit? Erzähl mir davon."],
      },
    ],
    problemQuestion: {
      key: "problem",
      texts: [
        "Danke, dass du so viel geteilt hast. Kannst du mir zum Schluss noch erzählen, was dich in letzter Zeit beunruhigt oder verärgert hat?",
      ],
    },
    dynamicInteraction: {
      loadingText: "Hmm... lass mich nachdenken...",
      fallbackQuestion: [
        "Es klingt, als hättet ihr eine wundervolle Geschichte. Kannst du mir als Nächstes sein Aussehen beschreiben?",
      ],
    },
    finalAcknowledgement: {
      texts: [
        "Danke, dass du das geteilt hast. Überlass den Rest mir. Ich werde deine Gefühle in eine warme Geschichte weben, um dir Kraft zu geben.",
      ],
    },
    buttons: { regenerate: "Ein anderer Traum", reset: "Neues Gespräch" },
  },
};
