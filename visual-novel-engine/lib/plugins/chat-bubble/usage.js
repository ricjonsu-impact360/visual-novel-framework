/**
 * Chat bubble plugins
 * Created by: Duc Le
 */


/**
 * Usage:
 *      Add 'plugins.chat-bubble.chat-bubble-manager' into main.js requires
 *      To spawn chat bubble, call: 
 *          ig.game.spawnChatBubble(ChatBubbleParentEntity, EntityChatBubbleConfigs);
 *          With:
 *              ChatBubbleParentEntity: is the entity instance that show the chat bubble
 *              EntityChatBubbleConfigs: configs for chat bubble
 */


/**
 * Example
 * When calling inside the ChatBubbleParentEntity
 */
ig.game.spawnChatBubble(this, {
    chatBubbleDrawConfigs: {
        textConfigs: {
            text: "This is<br>Bubble Chat", // text display in chat bubble
            fillStyle: "black",
            textAlign: "center", // [center|left|right];
            fontSize: 24,
            fontFamily: "Arial"
        },
        avatarConfigs: {
            image: null, // image display in chat bubble 
            size: { x: 100, y: 100 }, // image size
            padding: { x: 4, y: 4 } // extra space outside image
        },
        bubbleConfigs: {
            lineWidth: 2,
            fillStyle: "lightblue",
            strokeStyle: "black",

            shadowColor: "black",
            shadowBlur: 4,
            shadowOffsetX: 4,
            shadowOffsetY: 4,

            box: {
                width: 200, // content min width
                height: 100, // content min height
                round: 10, // round curves distance
                padding: { x: 10, y: 10 } // extra space outside the content area
            },
            tail: {
                length: 30, // tail length
                width: 15, // tail width
                direction: { x: 0.5, y: 1 } // tail direction, will be update if input invalid (0-1)
            }
        }
    },
    chatBubbleAppearTime: 0.4, // appear time - second
    chatBubbleAliveTime: 3, // alive time - second
    chatBubbleDisappearTime: 0.2, // disappear time - second
    chatBubblePercent: { x: 0.5, y: 0 }, // position percent of ChatBubbleParentEntity (0-1) related to the ChatBubbleParentEntity position and size
    chatBubbleOffset: { x: 0, y: 0 }, // extra offset from position percent of ChatBubbleParentEntity
    chatBubbleAlpha: 0.8 // chat bubble alpha
});