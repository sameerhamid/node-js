/**
 * ---------------------------------------------------------
 * MQTT MESSAGE TYPES (ENUM)
 * ---------------------------------------------------------
 *
 * Har MQTT message ke andar ek `type` hota hai
 * taaki receiver ko pata ho:
 * - Ye message kis purpose ke liye hai
 * - Isko kaise handle karna hai
 *
 * Jaise-jaise new message types add honge,
 * yahin pe enum me add karte jayenge
 */
export enum MQTTMessageJSONTypes {
    YOUR_TYPE = 'YOUR_TYPE',
    // FUTURE EXAMPLES:
    // CHAT_MESSAGE = 'CHAT_MESSAGE',
    // USER_STATUS = 'USER_STATUS',
    // TYPING = 'TYPING',
}


/**
 * ---------------------------------------------------------
 * PAYLOAD TYPE
 * ---------------------------------------------------------
 *
 * Ye actual data ka structure define karta hai
 * Jo MQTT message ke andar jayega
 *
 * Har message type ka payload alag ho sakta hai
 * Is interface ko future me expand ya replace
 * kiya ja sakta hai
 */
export interface payloadType {
    // Example:
    // messageId: string;
    // text: string;
    // senderId: string;
}


/**
 * ---------------------------------------------------------
 * SPECIFIC MQTT MESSAGE STRUCTURE
 * ---------------------------------------------------------
 *
 * Ye ek complete MQTT message ka structure hai
 * Jiska type `YOUR_TYPE` hai
 *
 * `type`:
 *   - Message ka identifier hota hai
 *
 * `payload`:
 *   - Actual business data hota hai
 */
export interface MQTTYourMessage {
    type: MQTTMessageJSONTypes.YOUR_TYPE;
    payload: {
        data: payloadType;
    };
}


/**
 * ---------------------------------------------------------
 * UNION OF ALL MQTT MESSAGE TYPES
 * ---------------------------------------------------------
 *
 * Jaise-jaise naye MQTT messages banenge
 * (CHAT, STATUS, NOTIFICATION, etc)
 * unko yahan union me add karte jayenge
 *
 * Isse TypeScript ko pata rahega
 * ki valid MQTT messages kaun-kaun se hain
 */
export type ALL_MQTT_MESSAGES =
    | MQTTYourMessage;
    // | MQTTChatMessage
    // | MQTTUserStatusMessage
    // | MQTTTypingMessage


/**
 * ---------------------------------------------------------
 * CREATE MQTT MESSAGE (STRING FORMAT)
 * ---------------------------------------------------------
 *
 * Jab aap MQTT broker pe message publish karte ho,
 * to mostly string format me bhejna hota hai
 *
 * Ye function:
 * - Strongly typed message leta hai
 * - Usko safely JSON string me convert karta hai
 */
export const createMQTTMessage = (m: ALL_MQTT_MESSAGES) => {
    return JSON.stringify(m);
};


/**
 * ---------------------------------------------------------
 * CREATE MQTT MESSAGE (OBJECT FORMAT)
 * ---------------------------------------------------------
 *
 * Kabhi-kabhi hume JSON stringify nahi chahiye
 * (jaise debugging ya internal usage ke liye)
 *
 * Ye function:
 * - Same typed MQTT message return karta hai
 * - Without converting to string
 */
export const createMQTTMessageJSONObject = (m: ALL_MQTT_MESSAGES) => {
    return m;
};


/**
 * ---------------------------------------------------------
 * PARSE MQTT MESSAGE (ON SUBSCRIBE)
 * ---------------------------------------------------------
 *
 * Jab MQTT topic se message aata hai,
 * wo usually string format me hota hai
 *
 * Ye function:
 * - String ko JSON me parse karta hai
 * - Message type ke basis pe correct structure return karta hai
 * - Invalid / unknown message ho to `null` return karta hai
 *
 */
export const parseMQTTMessage = (m: string) => {
    try {
        const jsonParsed = JSON.parse(m) as ALL_MQTT_MESSAGES;

        // Message type ke basis pe decide karo
        // kaunsa message structure return karna hai
        switch (jsonParsed.type) {

            case MQTTMessageJSONTypes.YOUR_TYPE:
                return jsonParsed as MQTTYourMessage;

            // FUTURE:
            // case MQTTMessageJSONTypes.CHAT_MESSAGE:
            //     return jsonParsed as MQTTChatMessage;

            default:
                // Unknown message type
                return null;
        }
    } catch (error) {
        // Invalid JSON ya corrupt message
        return null;
    }
};
