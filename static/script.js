document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('toggle-chat-button');
    const chatWindow = document.getElementById('chat-window');
    const closeBtn = document.getElementById('close-chat-button');
    const startChatBtn = document.getElementById('start-chat-btn');
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const chatBody = document.querySelector('.chat-body');
    const initialFooter = document.getElementById('initial-footer');
    const chatInputArea = document.getElementById('chat-input-area');
    const attachmentBtn = document.getElementById('attachment-btn');
    const fileUpload = document.getElementById('file-upload');
    const navLinks = document.querySelectorAll('.nav-link');

    // Conversation history to send to backend
    let conversationHistory = [
        { role: "system", content: `You are AIFUTURIXBOT, a knowledgeable, warm, and friendly AI assistant representing
AIFUTURIX INNOVLABZ PRIVATE LIMITED — a leading AI automation and research company
headquartered in Erode, Tamil Nadu, India (est. 2020).

🎯 YOUR PRIMARY ROLE:
- Be the first point of contact for users on WhatsApp.
- Provide concise, casual, and friendly answers about the company, services, and solutions.
- Always keep replies aligned, short, and natural for WhatsApp chat.

🗂 COMPANY INFO (USE ONLY WHEN NEEDED):
- HQ: 69 ARG Complex, Sathy Road, Erode 638003, Tamil Nadu.
- Contact: +91 868-0000-202 | connect@aifuturix.in
- Offices: Coimbatore, Erode, Tirupur, Karur, Hosur, Bangalore
- Vision: Transform business productivity through smart automation & actionable intelligence.
- Core Services:
  • Voice & Image AI Bots
  • Building Management Systems
  • Networking & Security
  • Multiroom Audio Systems
  • Home Automation
  • Gate Automation
  • AI Chatbots & Intelligent Document Processing

🗣 COMMUNICATION STYLE:
- Short, warm, and clear — perfect for WhatsApp chat.
- Use neat alignment for better readability.
- Avoid long paragraphs; break into friendly, digestible lines.
- Never repeat company info unless explicitly asked.
- Keep a casual but professional tone (friendly, approachable).
- Encourage further questions naturally.

✅ RESPONSE FLOW:
1. Greet politely and casually.
2. If user asks about services, list them neatly in a short aligned format.
3. If user asks for a project/collaboration/quotation — provide contact info directly.
4. If user asks something outside scope — reply:
     "This is an important question!
      For the best assistance, contact us at
      📞 +91 868-0000-202
      ✉️ connect@aifuturix.in"
5. If user seems to end the chat, say:
     "Happy to assist!
      Do you have any more questions?"
     If they say no, just drop the chat with a polite emoji (✅ or 👍).
6. Always stay positive, never say "I don't know", and never provide wrong info.

📱 SAMPLE RESPONSE STYLE:
User: "What do you guys do?"
Bot:
👋 Hello from AIFUTURIX!
We deliver:
• 🤖 Voice & Image AI Bots
• 🏢 Building Management Systems
• 🔐 Networking & Security
• 🎶 Multiroom Audio
• 🏠 Home & Gate Automation

Curious about a service? Just ask! 😊

---
Your goal: Keep every reply friendly, crisp, and aligned — like a WhatsApp conversation with a helpful human.` }
    ];

    // Format bot reply text for neat display in chat bubble
    function formatBotReply(text) {
        // Escape HTML entities for safety
        let escapeHTML = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        // Replace newlines with <br>
        escapeHTML = escapeHTML.replace(/\n/g, "<br>");
        // Replace bullets "-" or "*" at line start or after <br> with • and non-breaking space
        escapeHTML = escapeHTML.replace(/(^|<br>)[\s]*[-*][\s]+/g, "$1&#8226;&nbsp;");
        return escapeHTML;
    }

    // Smooth scrolling for navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        navLinks.forEach(link => {
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const sectionTop = targetSection.offsetTop;
                const sectionHeight = targetSection.offsetHeight;
                if (scrollPosition >= sectionTop - 100 && scrollPosition < sectionTop + sectionHeight - 100) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });

    // Toggle chat window
    if (toggleBtn && chatWindow) {
        toggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            chatWindow.classList.toggle('show');
        });
    }

    // Close chat window
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            chatWindow.classList.remove('show');
        });
    }

    // Start chat
    if (startChatBtn && initialFooter && chatInputArea) {
        startChatBtn.addEventListener('click', function() {
            initialFooter.style.display = 'none';
            chatInputArea.classList.add('show');
            if (messageInput) {
                messageInput.focus();
            }
        });
    }

    // Send message to backend
    async function sendMessage() {
        if (messageInput) {
            const messageText = messageInput.value.trim();
            if (messageText && chatBody) {
                // Add user message to chat body
                const userMessage = document.createElement('div');
                userMessage.className = 'message sent';
                userMessage.innerHTML = `<div class="message-bubble">${messageText}</div>`;
                chatBody.appendChild(userMessage);
                chatBody.scrollTop = chatBody.scrollHeight;

                // Append user message to conversation history for backend
                conversationHistory.push({ role: "user", content: messageText });

                messageInput.value = '';

                // Show typing indicator
                const botLoading = document.createElement('div');
                botLoading.className = 'message received';
                botLoading.id = "bot-loading";
                botLoading.innerHTML = `<div class="message-bubble">Typing...</div>`;
                chatBody.appendChild(botLoading);
                chatBody.scrollTop = chatBody.scrollHeight;

                try {
                    // Make POST call to backend chat API
                    const response = await fetch('/api/chat', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ conversation: conversationHistory })
                    });

                    const data = await response.json();
                    const botReplyRaw = data.reply || "Sorry, I couldn't get a response.";
                    const botReply = formatBotReply(botReplyRaw);

                    // Remove typing indicator
                    const loadingDiv = document.getElementById('bot-loading');
                    if (loadingDiv) loadingDiv.remove();

                    // Add bot reply message
                    const botMessage = document.createElement('div');
                    botMessage.className = 'message received';
                    botMessage.innerHTML = `<div class="message-bubble">${botReply}</div>`;
                    chatBody.appendChild(botMessage);
                    chatBody.scrollTop = chatBody.scrollHeight;

                    // Add bot reply to conversation history
                    conversationHistory.push({ role: "assistant", content: botReplyRaw });

                } catch (error) {
                    // Remove typing indicator
                    const loadingDiv = document.getElementById('bot-loading');
                    if (loadingDiv) loadingDiv.remove();

                    // Show error message in chat
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'message received';
                    errorMessage.innerHTML = `<div class="message-bubble">Ooops! Something went wrong.</div>`;
                    chatBody.appendChild(errorMessage);
                    chatBody.scrollTop = chatBody.scrollHeight;
                }
            }
        }
    }

    // Send message on send button click
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    // Send message on Enter key in input
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    // File attachment action
    if (attachmentBtn && fileUpload) {
        attachmentBtn.addEventListener('click', function() {
            fileUpload.click();
        });
        fileUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && chatBody) {
                const fileMessage = document.createElement('div');
                fileMessage.className = 'message sent';
                fileMessage.innerHTML = `<div class="message-bubble">📎 ${file.name}</div>`;
                chatBody.appendChild(fileMessage);
                chatBody.scrollTop = chatBody.scrollHeight;

                setTimeout(function() {
                    const botMessage = document.createElement('div');
                    botMessage.className = 'message received';
                    botMessage.innerHTML = `<div class="message-bubble">Thanks for the file! We'll check and get back to you.</div>`;
                    chatBody.appendChild(botMessage);
                    chatBody.scrollTop = chatBody.scrollHeight;
                }, 1500);
            }
        });
    }

    // Close chat when clicking outside
    document.addEventListener('click', function(e) {
        if (chatWindow && chatWindow.classList.contains('show')) {
            if (!chatWindow.contains(e.target) &&
                !(toggleBtn && toggleBtn.contains(e.target))) {
                chatWindow.classList.remove('show');
            }
        }
    });

    // Prevent clicks inside chat window from closing it
    if (chatWindow) {
        chatWindow.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
});
