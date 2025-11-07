ig.module(
    'plugins.chat-bubble.factory.avatar'
).defines(function () {
    "use strict";

    ig.ChatBubble.Factory.Avatar = {
        generate: function (configs, contentCanvas) {
            if (!configs.image) return {
                configs: configs,
                canvas: contentCanvas
            };

            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');

            // update canvas size
            canvas.width = configs.size.x + configs.padding.x * 2;
            canvas.height = configs.size.y + configs.padding.y * 2;

            // update canvas size with content
            if (contentCanvas) {
                canvas.width += contentCanvas.width + configs.padding.x;

                if (contentCanvas.height > canvas.height) {
                    canvas.height = contentCanvas.height;
                }
            }

            this.draw(configs, context);
            this.drawContentCanvas(configs, context, contentCanvas);

            return {
                configs: configs,
                canvas: canvas
            };
        },

        draw: function (configs, ctx) {
            var width = configs.size.x;
            var height = configs.size.y;

            var x = configs.padding.x;
            var y = ctx.canvas.height * 0.5 - height * 0.5;

            ctx.drawImage(
                configs.image.data,
                x,
                y,
                width,
                height
            );
        },

        drawContentCanvas: function (configs, ctx, contentCanvas) {
            if (!contentCanvas) return ctx;

            var x = configs.size.x + configs.padding.x * 2;
            var y = ctx.canvas.height * 0.5 - contentCanvas.height * 0.5;

            ctx.drawImage(contentCanvas, x, y);
        }
    };

    ig.ChatBubble.Factory.Avatar.DEFAULT_CONFIGS = {
        image: null,
        size: { x: 100, y: 100 },
        padding: { x: 4, y: 4 }
    };
});