// create namespace
ig.ChatBubble.Factory = {};

ig.module(
    'plugins.chat-bubble.chat-bubble-factory'
).requires(
    'plugins.chat-bubble.factory.text',
    'plugins.chat-bubble.factory.avatar',
    'plugins.chat-bubble.factory.bubble'
).defines(function () {
    "use strict";

    ig.ChatBubble.FactoryManager = {
        deepCopyAndMergerConfigs: function (baseConfigs, targetConfigs) {
            var configs = JSON.parse(JSON.stringify(baseConfigs));

            ig.merge(configs, targetConfigs);
            return configs;
        },

        generateCanvas: function (configs) {
            var canvasData = this.generateText(configs);

            canvasData = this.generateAvatar(canvasData.configs, canvasData.canvas);
            canvasData = this.generateBubble(canvasData.configs, canvasData.canvas);

            return canvasData;
        },

        generateText: function (configs) {
            var textConfigs = this.deepCopyAndMergerConfigs(ig.ChatBubble.Factory.Text.DEFAULT_CONFIGS, configs.textConfigs);

            var canvasData = ig.ChatBubble.Factory.Text.generate(textConfigs);
            configs.textConfigs = textConfigs;
            canvasData.configs = configs;

            return canvasData;
        },

        generateAvatar: function (configs, contentCanvas) {
            var avatarConfigs = this.deepCopyAndMergerConfigs(ig.ChatBubble.Factory.Avatar.DEFAULT_CONFIGS, configs.avatarConfigs);

            var canvasData = ig.ChatBubble.Factory.Avatar.generate(avatarConfigs, contentCanvas);
            configs.avatarConfigs = avatarConfigs;
            canvasData.configs = configs;

            return canvasData;
        },

        generateBubble: function (configs, contentCanvas) {
            var bubbleConfigs = this.deepCopyAndMergerConfigs(ig.ChatBubble.Factory.Bubble.DEFAULT_CONFIGS, configs.bubbleConfigs);

            var canvasData = ig.ChatBubble.Factory.Bubble.generate(bubbleConfigs, contentCanvas);
            configs.bubbleConfigs = bubbleConfigs;
            canvasData.configs = configs;

            return canvasData;
        }
    };
});