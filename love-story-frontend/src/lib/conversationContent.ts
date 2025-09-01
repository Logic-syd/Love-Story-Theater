// src/lib/conversationContent.ts

type FormDataKey =
  | "name"
  | "meetingContext"
  | "memories"
  | "appearance"
  | "work"
  | "personality"
  | "problem";

export interface Question {
  key: FormDataKey;
  texts: string[];
}

// Add all UI text to the language pack
interface LanguagePack {
  appTitle: string;
  inputPlaceholder: string;
  copySuccessMessage: string;
  storyGenerationError: string;
  regenerateThinking: string;
  regenerateError: string;
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
  loadingMessages: string[];
  regenerateThinkingMessage: string; // 新增字段
}

export const content: Record<string, LanguagePack> = {
  // --- Chinese Content ---
  zh: {
    appTitle: "疗愈收容所",
    inputPlaceholder: "请输入你的回答...",
    copySuccessMessage: "故事已复制到剪贴板！",
    storyGenerationError: "抱歉，故事生成失败了，请检查后端服务或稍后再试。",
    regenerateThinking: "好的，我们换一个角度，再来看一次你们美好的未来...",
    regenerateError: "抱歉，故事再次生成失败了...",
    nameQuestion: {
      key: "name",
      texts: [
        "最近是不是总想起他？他叫什么名字来着？",
        "你还放不下他吧…告诉我，他是谁？",
        "最近在不开心吗？先别急着解释，告诉我他的名字，好吗？",
        "你在不开心吗？我就猜到了。他叫什么名字？",
        "你是不是最近有什么事想说，你先告诉我他是谁。",
        "你心里那个人，是谁？可以跟我说说吗？",
        "你脑子里反复出现的那个名字，是不是还很清晰？",
        "是不是有些话你憋了很久了？那个人的名字，你还记得吧？",
        "你是不是还是会想：如果当时他… 先别想太多，先告诉我他是谁。",
        "你是不是一直不敢删掉他的聊天记录？他叫什么名字？",
        "就从他是谁开始讲吧，我想好好听你说一次。",
        "最近你状态我有感觉到，是不是又梦到他了？叫什么？",
        "你舍不得的是不是那段时光，还有他。告诉我，他是谁？",
        "我们不分析也不安慰，先说说他叫什么，好吗？",
        "我猜你最近总在翻以前的照片，对不对？他是谁？",
        "你不用解释太多，我懂的。先告诉我，他叫什么名字。",
      ],
    },
    poolA: [
      {
        key: "meetingContext",
        texts: [
          // 短句
          "你们第一次见面是在哪里呀？",
          "那时候周围是什么样子的还记得吗？",
          "你们是怎么认识的啦？",
          "第一次见他的时候是什么感觉呀？",

          // 中长句
          "你还记得第一次见面时候的样子吗？那天天气好不好呀？",
          "第一次见面紧张吗？还是说一见面就觉得是他了？",
          "是在哪里第一次见的？",

          // 长句，温柔细腻版
          "有时候觉得第一次见面的小细节最让人难忘了",
          "你那时候是一下子就心动了，还是后来慢慢喜欢上的呀？",
          "现在想想，第一次见面的时候有没有什么事情...是后来才明白是什么意思的？",
          "如果要用一个画面来形容第一次见他，会是什么样的呢？",
        ],
      },
      {
        key: "memories",
        texts: [
          // 短句
          "你们之间最难忘的事是什么？",
          "现在想起来，最深刻的回忆是哪个？",
          "他做过什么事让你记到现在？",
          "这段感情里，你最放不下的是哪个片段？",

          // 中长句
          "如果现在让你回想，第一个浮现的回忆会是什么？",
          "你们有没有哪个瞬间，是无论如何都忘不掉的？",
          "你觉得这段关系里，最值得被记住的是什么？",
          "有没有一件事，让你觉得'这辈子都不会忘记'？",

          // 长句（带缓冲语气）
          "虽然问这个可能有点难...但你们之间最珍贵的回忆是什么？",
          "我知道回忆起来会不舒服...但有没有哪个时刻，是你想好好封存起来的？",
        ],
      },
    ],
    poolB: [
      {
        key: "appearance",
        texts: [
          "他帅到哪种程度啊，我完全不敢信",
          "别跟我说什么气质帅，形容一下具体什么样",
          "你是不是恋爱滤镜太厚了？真的很好看吗？",
          "是那种大家都觉得好看，还是只有你自己觉得特别？",
          "你一直觉得他好看吗，是不是中毒太深？",
          "到底是五官出众，还是氛围感拿捏住你了？",
          "你给我形容清楚，是精致型，还是糙帅型？",
          "他一走过来你是那种会心跳加速的程度吗？",
          "说实话，第一次见他你有惊艳到吗？",
          "是不是你见他的那一瞬间，心里就“咯噔”了一下？",
          "那种帅是别人也会注意到的，还是你独享的秘密帅？",
          "你说的他的长相到底是哪种水平？路人回头看那种吗？",
          "他有那种镜头感吗？拍照能打吗？",
          "帅是他长得帅，还是你太喜欢他所以觉得帅？",
        ],
      },
      {
        key: "work",
        texts: [
          "那他是做什么工作的呢？",
          "可以告诉我他的职业吗？",
          "他平时是在哪儿上班呀？",
          "哦对，他是哪个行业的来着？",
          "他工作会不会特别忙那种？",
        ],
      },
      {
        key: "personality",
        texts: [
          "那到目前为止，你觉得他最吸引你的性格是什么？",
          "他是属于话多那种，还是安静型？",
          "你们俩性格互补吗？还是都是一强一弱那种？",
          "有没有哪个瞬间你觉得‘哇，这个人性格真不错’？",
          "平时他是情绪稳定型吗？吵架的时候谁先低头？",
          "你们吵过架吗？是性格问题，还是其他的事？",
          "他有没有让你觉得‘这人也太轴了’的时候？",
          "他会不会有点控制欲？还是比较随和那种？",
          "你觉得他有没有什么你需要特别去迁就的地方？",
          "有没有哪一瞬间你觉得‘我们两个真的性格不合’？",
          "你有没有为了他的某些性格特质纠结过？",
          "他那种人是你以前喜欢的类型吗？还是突然破圈了？",
          "有没有哪种场合他表现得特别出人意料？性格反转那种～",
          "他是不是在你面前和在别人面前性格差很大？",
          "有没有你特别受不了他的一点？比如太慢、太急、太爱讲大道理什么的。",
          "他平时是容易紧张的人吗？还是超级 chill？",
          "和他在一起，你觉得自己变得更放松了，还是更小心翼翼了？",
          "你觉得他有没有真正理解你的性格？还是还在摸索中？",
          "如果你要用三个词形容他的性格，会选什么？",
        ],
      },
    ],
    problemQuestion: {
      key: "problem",
      texts: [
        "最近感情上有什么想跟我说的，不管多难，我都愿意听你说。",
        "所以你们最近是关系变坏了吗？有啥心里话，别憋着，跟我说说嘛，我陪你。",
        "你想说说你们之间的问题吗？",
        "慢慢说，不着急，把你的感情故事都告诉我吧。",
        "遇到什么烦心事了？别一个人闷着，我陪着你。",
        "你心里难受的事，说给我听听，好不好？",
        "最近你们遇到问题了吗？有些话，不说出来会难受，告诉我，我帮你分担。",
        "我知道感情不容易，有什么想说的，现在跟我说。",
        "最近遇到的感情问题，不妨跟我聊聊，我陪你一起想。",
        "是不是有心里有话想说，没关系，你们之间出现什么问题了，我听着呢。",
        "你们现在遇到什么问题了吗？想说的都说出来，别让难过憋着，咱们一起面对。",
        "你最近是不是有点累？把感情上的事跟我说说吧。",
        "不管多烦，我都在，你可以放心说。你们之间出现问题了吗",
        "别怕，我在这里，愿意听你分享感情里的点点滴滴。你们之间最近是不是遇到什么问题了？",
        "想哭就哭，想说就说，我一直陪着你。",
        "有时候说出来就舒服了，愿意跟我说说你的故事吗？",
        "我知道感情的事很复杂，慢慢跟我说，我不急。你和他最近发生了什么不好的事吗",
        "你有什么感情上的困扰，别藏着，我听着呢。",
        "把心里的委屈说给我听，好吗？我陪着你。",
        "别一个人扛着，有什么感情上的烦恼，我们一起来聊聊。",
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
        "谢谢你的倾诉...请把剩下的交给我，我会把你的心情编织成一个温暖的故事来给你力量。好吗？",
        "收到了，宝贝。谢谢你愿意相信我。让我为你构想一个充满希望的未来吧...好吗？",
      ],
    },
    buttons: { regenerate: "换一个梦境", reset: "开启新对话" },
    loadingMessages: [
      "正在连接梦境的彼岸...",
      "我看到了你们在阳光下散步的画面...",
      "正在为你编织一个温暖的拥抱...",
      "别急，美好的事物总需要一点点酝酿...",
      "我听到了他未来的心跳声，很稳，很安心...",
      "未来的画卷正在缓缓展开...",
      "再一下下，这个充满希望的梦就要完成了。",
    ],
    regenerateThinkingMessage:
      "好的，我们换一个角度，再来看一次你们美好的未来...",
  },

  // --- English Content (Now Complete) ---
  en: {
    appTitle: "WarmWhisper",
    inputPlaceholder: "Type your answer...",
    copySuccessMessage: "Story copied to clipboard!",
    storyGenerationError:
      "Sorry, story generation failed. Please check the backend service or try again later.",
    regenerateThinking:
      "Okay, let's look at it from another angle and see your beautiful future again...",
    regenerateError: "Sorry, regenerating the story failed...",
    nameQuestion: {
      key: "name",
      texts: [
        "You’ve been thinking about him lately, haven’t you? What’s his name?",
        "No rush, let’s just start with his name.",
        "I’m all ears. What’s his name?",
        "Do you want to tell me who’s been on your mind?",
        "Maybe we start from the beginning—what’s his name?",
        "Is there someone you can’t quite let go of? What’s his name?",
        "When was the last time you thought of him? Or maybe… you never stopped?",
        "Tell me his name—sometimes saying it out loud helps.",
        "Is he still in your dreams? What’s his name?",
        "I get the feeling he still takes up space in your heart. Who is he?",
        "Who’s the one that’s been making your heart ache lately?",
        "You don’t have to say much. Just start with his name.",
        "Is it okay if I ask—what’s his name?",
        "Let’s take it slow. Who is he?",
        "Still thinking about him sometimes? What’s his name?",
        "What name do you still hesitate to delete from your phone?",
        "That one person you never really stopped caring about—who is he?",
        "What’s the name that still lingers when the room goes quiet?",
        "If you had to say just one word to start… would it be his name?",
        "I’m here for you. Start wherever feels okay. Maybe with his name.",
      ],
    },
    poolA: [
      {
        key: "meetingContext",
        texts: [
          // Short
          "Where did you two first meet?",
          "Do you remember what the place was like?",
          "How did you guys actually meet?",
          "What was your first impression of him?",

          // Medium
          "Do you remember little details from that first meeting? Like the weather or the atmosphere?",
          "Were you nervous at first, or did it feel comfortable right away?",
          "Was it at a café or just walking around somewhere?",
          "Did he say anything that stuck with you from that first conversation?",
          "Did you notice any cute little habits he had? Like playing with his hair when talking?",

          // Long
          "Does it hurt to think about that first meeting place now? That little coffee shop... or the park bench...",
          "Sometimes it's the smallest details that stay with us - what he was wearing, how his voice sounded...",
          "Was it love at first sight for you, or did the feelings grow later?",
          "Looking back... were there any moments from that first meeting that mean something different now?",
          "If you had to describe your first meeting as a scene from a movie, how would it look?",
        ],
      },
      {
        key: "memories",
        texts: [
          // Short
          "What's your most unforgettable memory with him?",
          "Is there a moment that still feels special when you look back?",
          "What did he do that left the deepest impression on you?",
          "Which part of this relationship stays with you the most?",

          // Medium
          "If you had to pick one memory, what would come to mind first?",
          "Was there a moment between you two that feels impossible to forget?",
          "What do you think is most worth remembering from this relationship?",
          "Is there something you feel you'll carry with you forever?",

          // Long (with buffer phrases)
          "This might be hard to answer... but what feels most precious from your time together?",
          "I know it's painful to remember... but is there any moment you'd want to preserve?",
        ],
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
        texts: [
          "So, what's he really like? Spill the tea!",
          "Is he the funny type or more serious?",
          "Does he have any weird habits you find cute?",
          "You two get along well, or is it more like opposite attracts?",
          "Ever caught him doing something totally unexpected?",
        ],
      },
    ],
    problemQuestion: {
      key: "problem",
      texts: [
        "If there’s anything on your mind about your relationship, I’m here to listen, no matter how hard it is.",
        "Don’t keep it all inside, tell me what’s been bothering you—I’m here for you.",
        "Want to talk about what’s been making you feel uneasy? I’m all ears.",
        "Take your time, no rush. Share your story with me whenever you’re ready.",
        "Feeling weighed down? You don’t have to carry it alone, I’m here with you.",
        "What’s been on your heart? Tell me, okay?",
        "Sometimes sharing helps. You can tell me anything, I’ll help carry the weight.",
        "I know relationships can be tough. Whenever you want to talk, I’m here.",
        "If something’s been troubling you, don’t hesitate to share. We’ll figure it out together.",
        "I’m here to listen whenever you want to open up.",
        "Don’t bottle it up—let it out. We can face it together.",
        "Feeling tired lately? Tell me what’s going on with your relationship.",
        "No matter how hard it feels, I’m here. You can trust me.",
        "I’m here to hear every little thing you want to share about your feelings.",
        "If you want to cry, cry. If you want to talk, I’m right here.",
        "Sometimes just saying it out loud makes it easier. Want to share your story?",
        "I know relationships are complicated. Take your time and tell me what’s on your mind.",
        "Whatever’s been troubling you, I’m listening.",
        "Tell me what’s weighing on your heart. I’m here with you.",
        "You don’t have to go through this alone. Let’s talk about what’s bothering you.",
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
    loadingMessages: [
      "Connecting to the other side of the dream...",
      "I see a vision of you walking in the sun...",
      "Weaving a warm hug for you...",
      "Don't rush, beautiful things take time...",
      "I can hear his future heartbeat, it's steady and reassuring...",
      "The canvas of the future is slowly unfolding...",
      "Just a moment more, this hopeful dream is almost complete.",
    ],
    regenerateThinkingMessage:
      "Alright, let’s look at your beautiful future from a new perspective...",
  },

  // --- German Content (Now Complete) ---
  de: {
    appTitle: "Lichtpunkt",
    inputPlaceholder: "Gib deine Antwort ein...",
    copySuccessMessage: "Geschichte in die Zwischenablage kopiert!",
    storyGenerationError:
      "Entschuldigung, die Erstellung der Geschichte ist fehlgeschlagen. Bitte überprüfen Sie den Backend-Dienst oder versuchen Sie es später erneut.",
    regenerateThinking:
      "Okay, lass es uns aus einem anderen Blickwinkel betrachten und noch einmal eure schöne Zukunft ansehen...",
    regenerateError:
      "Entschuldigung, das erneute Erstellen der Geschichte ist fehlgeschlagen...",
    nameQuestion: {
      key: "name",
      texts: [
        "Denkst du in letzter Zeit oft an ihn? Wie heißt er?",
        "Willst du mir sagen, wer dir gerade nicht aus dem Kopf geht?",
        "Wir können ganz langsam anfangen. Wie heißt er?",
        "Möchtest du mir einfach nur seinen Namen sagen?",
        "Ich hör dir zu. Wie heißt er?",
        "Vielleicht starten wir einfach mit seinem Namen.",
        "Ist er jemand, den du noch nicht loslassen kannst? Wie heißt er?",
        "Hast du ihn neulich wieder im Traum gesehen? Wie war nochmal sein Name?",
        "Sag’s mir ruhig. Manchmal hilft es, den Namen laut auszusprechen.",
        "Wer ist derjenige, der immer noch in deinem Kopf spukt?",
        "Gibt es jemanden, bei dem dein Herz noch ein bisschen wehtut?",
        "Du musst mir gar nicht viel erklären. Sag mir nur seinen Namen.",
        "Wäre es okay, wenn ich frage… wie heißt er?",
        "Erzähl nur so viel, wie du willst. Fang mit seinem Namen an.",
        "Dieser eine Name, den du noch nicht löschen konntest—wer war das?",
        "Ist es der Name, der dir manchmal beim Einschlafen durch den Kopf geht?",
        "Ich glaube, du trägst ihn noch bei dir. Wie heißt er?",
        "Wenn du den ersten Schritt machen magst – wie heißt er?",
        "Ich bin da. Sag’s, wenn du bereit bist.",
        "Vielleicht reicht heute nur ein Name. Und das ist völlig okay.",
      ],
    },
    poolA: [
      {
        key: "meetingContext",
        texts: [
          // Kurz
          "Wo habt ihr euch eigentlich kennengelernt?",
          "Weißt du noch, wie es dort aussah?",
          "Wie seid ihr zwei euch näher gekommen?",
          "Wie war dein erster Eindruck von ihm?",

          // Mittel
          "Erinnerst du dich noch an kleine Details vom ersten Treffen? So wie das Wetter oder die Stimmung?",
          "Warst du am Anfang nervös oder hat es sich gleich richtig angefühlt?",
          "War das in einem Café oder seid ihr einfach spazieren gegangen?",
          "Hat er damals etwas gesagt, was dir besonders im Gedächtnis geblieben ist?",
          "Ist dir damals etwas Niedliches aufgefallen? Dass er zum Beispiel mit seinen Haaren gespielt hat, wenn er geredet hat?",

          // Lang
          "Tut es jetzt weh, an diesen Ort zurückzudenken? An dieses kleine Café... oder die Parkbank...",
          "Manchmal sind es die kleinsten Details - was er anhatte, wie seine Stimme klang...",
          "War es Liebe auf den ersten Blick oder ist das langsam gewachsen?",
          "Wenn du jetzt zurückdenkst... gab es Momente beim ersten Treffen, die jetzt eine andere Bedeutung haben?",
          "Wenn du euer erstes Treffen wie eine Filmszene beschreiben müsstest, wie würde sie aussehen?",
        ],
      },
      {
        key: "memories",
        texts: [
          // Kurz
          "Was ist eure unvergesslichste gemeinsame Erinnerung?",
          "Gibt es einen Moment, der sich für dich immer noch besonders anfühlt?",
          "Was hat er getan, das dich am meisten berührt hat?",
          "Welcher Teil dieser Beziehung bleibt dir am stärksten in Erinnerung?",

          // Mittel
          "Wenn du eine Erinnerung wählen müsstest, was würde dir als erstes einfallen?",
          "Gab es einen Augenblick zwischen euch, den du niemals vergessen wirst?",
          "Was ist aus dieser Beziehung am meisten bewahrenswert?",
          "Gibt es etwas, das du für immer bei dir tragen wirst?",

          // Lang (mit einfühlsamen Formulierungen)
          "Das ist vielleicht schwer zu beantworten... aber was fühlt sich aus eurer gemeinsamen Zeit am wertvollsten an?",
          "Ich weiß, dass es weh tut... aber gibt es einen Moment, den du bewahren möchtest?",
        ],
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
        texts: [
          "Und, wie ist er so wirklich? Erzähl mal alles!",
          "Ist er eher der Lustige oder der Ernsthafte?",
          "Hat er irgendwelche seltsamen Macken, die du irgendwie süß findest?",
          "Kommt ihr gut miteinander aus, oder ist das eher so 'Gegensätze ziehen sich an'?",
          "Hast du ihn schon mal total unerwartet erlebt?",
        ],
      },
    ],
    problemQuestion: {
      key: "problem",
      texts: [
        "Wenn dir etwas auf dem Herzen liegt wegen deiner Beziehung, ich höre dir zu, egal wie schwer es ist.",
        "Halte nichts für dich, erzähl mir, was dich belastet – ich bin für dich da.",
        "Möchtest du darüber sprechen, was dir Sorgen macht? Ich höre zu.",
        "Nimm dir Zeit, kein Stress. Erzähl mir deine Geschichte, wenn du bereit bist.",
        "Fühlst du dich belastet? Du musst das nicht allein tragen, ich bin bei dir.",
        "Was beschäftigt dich? Erzähl es mir, okay?",
        "Manchmal hilft es, Dinge zu teilen. Du kannst mir alles erzählen, ich helfe dir, die Last zu tragen.",
        "Ich weiß, Beziehungen sind nicht immer einfach. Wenn du reden willst, bin ich hier.",
        "Wenn dich etwas bedrückt, zögere nicht, es zu teilen. Wir finden zusammen eine Lösung.",
        "Ich bin hier und höre dir zu, wann immer du dich öffnen möchtest.",
        "Halte nichts zurück – lass es raus. Wir schaffen das gemeinsam.",
        "Fühlst du dich müde? Erzähl mir, was in deiner Beziehung los ist.",
        "Egal wie schwer es ist, ich bin da. Du kannst mir vertrauen.",
        "Ich höre dir zu, egal was du über deine Gefühle erzählen willst.",
        "Wenn du weinen willst, weine. Wenn du reden willst, ich bin hier.",
        "Manchmal hilft es, Dinge laut auszusprechen. Willst du deine Geschichte erzählen?",
        "Ich weiß, Beziehungen sind kompliziert. Nimm dir Zeit und sag mir, was dich bewegt.",
        "Was auch immer dich belastet, ich höre zu.",
        "Erzähl mir, was dir auf dem Herzen liegt. Ich bin bei dir.",
        "Du musst das nicht allein durchstehen. Lass uns darüber reden, was dich bedrückt.",
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
    loadingMessages: [
      "Verbinde mit dem jenseitigen Ufer des Traumes...",
      "Ich sehe Bilder von euch, wie ihr im Sonnenschein spaziert...",
      "Eine warme Umarmung wird für dich gewoben...",
      "Keine Eile, schöne Dinge brauchen ein wenig Zeit...",
      "Ich höre seinen zukünftigen Herzschlag, er ist ruhig und sicher...",
      "Das Bild der Zukunft entfaltet sich langsam...",
      "Nur noch einen Augenblick, dieser hoffnungsvolle Traum ist fast fertig.",
    ],
    regenerateThinkingMessage:
      "Okay, lass uns eure schöne Zukunft aus einem anderen Blickwinkel betrachten...",
  },
};
