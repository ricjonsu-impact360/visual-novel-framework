// create namespace
ig.ChatBubble = {};

ig.module(
    'plugins.chat-bubble.chat-bubble-manager'
).requires(
    'impact.game',
    'plugins.chat-bubble.chat-bubble'
).defines(function () {
    "use strict";

    ig.Game.inject({
        _spawnChatBubble: function (configs) {
            // addition configs
            if (typeof configs.zIndex === "undefined") configs.zIndex = configs.chatBubbleParent.zIndex + 1;

            // spawn entity
            var entity = ig.game.spawnEntity(ig.ChatBubble.Entity, Number.MIN_VALUE, Number.MIN_VALUE, configs);
            ig.game.sortEntitiesDeferred();

            // set chat bubble instance
            configs.chatBubbleParent.currentChatBubble = entity;

            return entity;
        },

        spawnChatBubble: function (chatBubbleParent, configs) {
            if (!chatBubbleParent) return;

            if (configs.chatBubbleDrawConfigs.bubbleConfigs.chatType != 'text') {
                if (chatBubbleParent.currentChatBubble) {
                    chatBubbleParent.currentChatBubble.closeChatBubble();
                    chatBubbleParent.currentChatBubble = null;
                }
            }

            if (!configs) configs = {};
            configs.chatBubbleParent = chatBubbleParent;

            return this._spawnChatBubble(configs);
        }
    });

    ig.Entity.inject({
        currentChatBubble: null,
        kill: function () {
            if (this.currentChatBubble) {
                this.currentChatBubble.closeChatBubble();
                this.currentChatBubble = null;
            }
            this.parent();
        }
    });
});