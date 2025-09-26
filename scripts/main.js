
        const appState = {
            chats: [
                {
                    id: 1,
                    name: "Oleg",
                    preview: "Hello there!",
                    time: "18:45",
                    notifications: 1,
                    messages: [
                        { text: "Hello! How can I help you?", incoming: true, time: "10:00" },
                        { text: "Hi! I wanted to ask about your services.", incoming: false, time: "10:01" },
                        { text: "Sure! What would you like to know?", incoming: true, time: "10:02" }
                    ]
                },
                {
                    id: 2,
                    name: "Eva",
                    preview: "How are you?",
                    time: "18:30",
                    notifications: 3,
                    messages: [
                        { text: "Hi Eva! How are you doing?", incoming: false, time: "09:30" },
                        { text: "I'm good, thanks for asking! How about you?", incoming: true, time: "09:31" }
                    ]
                },
                {
                    id: 3,
                    name: "Stepan",
                    preview: "See you tomorrow",
                    time: "17:15",
                    notifications: 0,
                    messages: [
                        { text: "Meeting tomorrow at 10 AM", incoming: true, time: "17:15" },
                        { text: "Got it, see you then!", incoming: false, time: "17:16" }
                    ]
                },
                {
                    id: 4,
                    name: "Mary",
                    preview: "Thanks for your help",
                    time: "16:45",
                    notifications: 2,
                    messages: [
                        { text: "Thanks for helping me with the project!", incoming: true, time: "16:45" },
                        { text: "No problem, happy to help!", incoming: false, time: "16:46" }
                    ]
                }
            ],
            currentChatId: null,
            nextChatId: 5
        };

        // DOM Elements
        const elements = {
            menuToggle: document.getElementById('menuToggle'),
            sidebar: document.getElementById('sidebar'),
            chatList: document.getElementById('chatList'),
            chatArea: document.getElementById('chatArea'),
            backButton: document.getElementById('backButton'),
            chatContactInfo: document.getElementById('chatContactInfo'),
            chatContactAvatar: document.getElementById('chatContactAvatar'),
            chatContactName: document.getElementById('chatContactName'),
            emptyState: document.getElementById('emptyState'),
            chatMessages: document.getElementById('chatMessages'),
            chatInput: document.getElementById('chatInput'),
            messageInput: document.getElementById('messageInput'),
            sendBtn: document.getElementById('sendBtn'),
            newChatBtn: document.getElementById('newChatBtn'),
            searchBox: document.getElementById('searchBox')
        };

        // Initialize Application
        function initApp() {
            renderChatList();
            setupEventListeners();
            checkMobileView();
        }

        // Render Chat List
        function renderChatList() {
            elements.chatList.innerHTML = '';
            
            appState.chats.forEach(chat => {
                const chatItem = document.createElement('div');
                chatItem.className = 'chat-item';
                chatItem.setAttribute('data-id', chat.id);
                
                chatItem.innerHTML = `
                    <div class="avatar">${chat.name.charAt(0)}</div>
                    <div class="chat-info">
                        <div class="chat-name">${chat.name}</div>
                        <div class="chat-preview">${chat.preview}</div>
                    </div>
                    <div class="chat-meta">
                        <div class="timestamp">${chat.time}</div>
                        ${chat.notifications > 0 ? `<div class="notification">${chat.notifications}</div>` : ''}
                    </div>
                `;
                
                elements.chatList.appendChild(chatItem);
            });
            
            // Add click handlers
            document.querySelectorAll('.chat-item').forEach(item => {
                item.addEventListener('click', function() {
                    const chatId = parseInt(this.getAttribute('data-id'));
                    openChat(chatId);
                });
            });
        }

        // Setup Event Listeners
        function setupEventListeners() {
            // Menu toggle
            elements.menuToggle.addEventListener('click', toggleSidebar);
            
            // Back button
            elements.backButton.addEventListener('click', closeChat);
            
            // Send message
            elements.sendBtn.addEventListener('click', sendMessage);
            elements.messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendMessage();
            });
            
            // New chat
            elements.newChatBtn.addEventListener('click', createNewChat);
            
            // Search
            elements.searchBox.addEventListener('input', filterChats);
            
            // Window resize
            window.addEventListener('resize', checkMobileView);
        }

        // Toggle Sidebar (Mobile)
        function toggleSidebar() {
            if (window.innerWidth <= 768) {
                elements.sidebar.classList.toggle('active');
            }
        }

        // Check Mobile View
        function checkMobileView() {
            if (window.innerWidth <= 768) {
                elements.sidebar.classList.remove('active');
            } else {
                elements.sidebar.classList.add('active');
            }
        }

        // Open Chat
        function openChat(chatId) {
            const chat = appState.chats.find(c => c.id === chatId);
            if (!chat) return;
            
            appState.currentChatId = chatId;
            
            // Update UI
            elements.emptyState.style.display = 'none';
            elements.chatContactInfo.style.display = 'flex';
            elements.chatMessages.style.display = 'flex';
            elements.chatInput.style.display = 'flex';
            
            // Set contact info
            elements.chatContactAvatar.textContent = chat.name.charAt(0);
            elements.chatContactName.textContent = chat.name;
            
            // Render messages
            renderMessages(chat.messages);
            
            // Reset notifications
            resetNotifications(chatId);
            
            // Hide sidebar on mobile
            if (window.innerWidth <= 768) {
                elements.sidebar.classList.remove('active');
            }
            
            // Focus input
            elements.messageInput.focus();
        }

        // Close Chat (Mobile)
        function closeChat() {
            if (window.innerWidth <= 768) {
                elements.emptyState.style.display = 'flex';
                elements.chatContactInfo.style.display = 'none';
                elements.chatMessages.style.display = 'none';
                elements.chatInput.style.display = 'none';
                elements.sidebar.classList.add('active');
                appState.currentChatId = null;
            }
        }

        // Render Messages
        function renderMessages(messages) {
            elements.chatMessages.innerHTML = '';
            
            messages.forEach(msg => {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${msg.incoming ? 'incoming' : 'outgoing'}`;
                messageDiv.innerHTML = `
                    <div>${msg.text}</div>
                    <div class="message-time">${msg.time}</div>
                `;
                elements.chatMessages.appendChild(messageDiv);
            });
            
            // Scroll to bottom
            elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
        }

        // Send Message
        function sendMessage() {
            const messageText = elements.messageInput.value.trim();
            if (!messageText || !appState.currentChatId) return;
            
            const chat = appState.chats.find(c => c.id === appState.currentChatId);
            if (!chat) return;
            
            // Create new message
            const now = new Date();
            const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
            
            const newMessage = {
                text: messageText,
                incoming: false,
                time: time
            };
            
            // Add to chat
            chat.messages.push(newMessage);
            chat.preview = messageText;
            chat.time = time;
            
            // Clear input
            elements.messageInput.value = '';
            
            // Update UI
            renderMessages(chat.messages);
            renderChatList();
            
            // Simulate response
            simulateResponse(chat);
        }

        // Simulate Response
        function simulateResponse(chat) {
            setTimeout(() => {
                const responses = [
                    "Thanks for your message!",
                    "I'll get back to you soon.",
                    "That's interesting, tell me more.",
                    "I agree with you.",
                    "Let me think about that."
                ];
                
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                const now = new Date();
                const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
                
                const responseMessage = {
                    text: randomResponse,
                    incoming: true,
                    time: time
                };
                
                chat.messages.push(responseMessage);
                chat.preview = randomResponse;
                chat.time = time;
                chat.notifications = (chat.notifications || 0) + 1;
                
                // Update UI
                if (appState.currentChatId === chat.id) {
                    renderMessages(chat.messages);
                }
                renderChatList();
            }, 1000 + Math.random() * 2000);
        }

        // Create New Chat
        function createNewChat() {
            const names = ["Alex", "Dima", "Olga", "Ivan", "Kate", "Max", "Anna"];
            const randomName = names[Math.floor(Math.random() * names.length)];
            
            const now = new Date();
            const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
            
            const newChat = {
                id: appState.nextChatId++,
                name: randomName,
                preview: "Start a conversation",
                time: time,
                notifications: 1,
                messages: []
            };
            
            // Add to beginning of list
            appState.chats.unshift(newChat);
            
            // Update UI
            renderChatList();
            
            // Open the new chat
            openChat(newChat.id);
        }

        // Filter Chats
        function filterChats() {
            const searchTerm = elements.searchBox.value.toLowerCase();
            const chatItems = document.querySelectorAll('.chat-item');
            
            chatItems.forEach(item => {
                const chatName = item.querySelector('.chat-name').textContent.toLowerCase();
                if (chatName.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        }

        // Reset Notifications
        function resetNotifications(chatId) {
            const chat = appState.chats.find(c => c.id === chatId);
            if (chat) {
                chat.notifications = 0;
                renderChatList();
            }
        }

        // Initialize when DOM is loaded
        document.addEventListener('DOMContentLoaded', initApp);
         // Элементы DOM
        const menuToggle = document.getElementById('menuToggle');
        const burgerMenu = document.getElementById('burgerMenu');
        const burgerClose = document.getElementById('burgerClose');
        const overlay = document.getElementById('overlay');

        // Открытие меню
        menuToggle.addEventListener('click', function() {
            burgerMenu.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Блокируем прокрутку фона
        });

        // Закрытие меню
        function closeMenu() {
            burgerMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = ''; // Восстанавливаем прокрутку
        }

        burgerClose.addEventListener('click', closeMenu);
        overlay.addEventListener('click', closeMenu);

        // Закрытие меню при нажатии на Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMenu();
            }
        });

        // Обработка кликов по пунктам меню
        document.querySelectorAll('.burger-item').forEach(item => {
            item.addEventListener('click', function() {
                const itemText = this.querySelector('span').textContent;
                alert(`Oops! The ${itemText} isn't working yet. `);
                closeMenu();
            });
        });
        