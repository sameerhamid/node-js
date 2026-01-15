import events from 'events';
import { connect, IClientPublishOptions, IClientSubscribeOptions, MqttClient } from "mqtt";

export const EventEmitter = new events.EventEmitter();

type SubscriptionCallback = (topic: string, message: string) => any;

const WILDCARD = '/#';

class MQTT {
    public initialConnectionSuccessful = false;
    private client: MqttClient;
    private topicToSubscribtionFunctions = new Map<string, SubscriptionCallback[]>();
    private wildCardSubscribers = new Set<string>();

    constructor() {
        const link = "";
        const username = "";
        const password = "";
        this.client = connect(link, { username, password, clientId: '' });
        this.client.on('connect', this.onConnect);
        this.client.on('message', this.onMessageReceived);
    }

    public publish = (topic: string, message: string, opts?: IClientPublishOptions) => {
        this.client.publish(topic, message, { ...(opts ?? {}), qos: 2 });
    }

    public subscribe = (topic: string, callback: SubscriptionCallback, opts?: IClientSubscribeOptions) => {
        this.client.subscribe(topic, { ...(opts ?? {}), qos: 2 });

        if (this.topicToSubscribtionFunctions.has(topic)) {
            this.topicToSubscribtionFunctions.get(topic)?.push(callback)
        } else {
            this.topicToSubscribtionFunctions.set(topic, [callback]);
        }
        if (topic.endsWith(WILDCARD)) {
            this.wildCardSubscribers.add(topic.substring(0, topic.length - 2)); // removed the last 2
        }
    }

    public close = () => {
        this.client && this.client.end();
    }

    private onConnect = () => {
        this.initialConnectionSuccessful = true;
        EventEmitter.emit('MQTT_CONNECTED');
        console.log('Connected to MQTT Client');
    }

    private onMessageReceived = (topic: string, payload: Buffer) => {
        const message = payload?.toString() ?? "";
        if (this.topicToSubscribtionFunctions.has(topic)) {
            const funcitons = this.topicToSubscribtionFunctions.get(topic);
            funcitons?.forEach(fn => fn(topic, message));
        }
        const allWildcardSubscribers = Array.from(this.wildCardSubscribers);
        allWildcardSubscribers.forEach(topicStartsWith => {
            if (topic.startsWith(topicStartsWith)) {
                const funcitons = this.topicToSubscribtionFunctions.get(topicStartsWith + WILDCARD);
                funcitons?.forEach(fn => fn(topic, message));
            }
        })
    }
}

const mqttClient = new MQTT();

process.on('SIGINT', msg => {
    mqttClient.close();
});

export default mqttClient;
