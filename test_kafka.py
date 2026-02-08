from kafka import KafkaProducer, KafkaConsumer
import json
import time

# Configuration
# For local testing via port-forward to external listener
BOOTSTRAP_SERVERS = '127.0.0.1:9094'
TOPIC_NAME = 'test-topic'

def produce_messages():
    producer = KafkaProducer(
        bootstrap_servers=BOOTSTRAP_SERVERS,
        value_serializer=lambda v: json.dumps(v).encode('utf-8')
    )
    
    for i in range(5):
        message = {'number': i, 'timestamp': time.time()}
        producer.send(TOPIC_NAME, message)
        print(f"Sent: {message}")
        time.sleep(1)
        
    producer.flush()
    producer.close()

def consume_messages():
    consumer = KafkaConsumer(
        TOPIC_NAME,
        bootstrap_servers=BOOTSTRAP_SERVERS,
        auto_offset_reset='earliest',
        value_deserializer=lambda x: json.loads(x.decode('utf-8')),
        consumer_timeout_ms=5000  # Stop after 5 seconds of no messages
    )
    
    print("Listening for messages...")
    for message in consumer:
        print(f"Received: {message.value}")
        
    consumer.close()

if __name__ == '__main__':
    print(f"Connecting to {BOOTSTRAP_SERVERS}...")
    try:
        print("Producing...")
        produce_messages()
        print("\nConsuming...")
        consume_messages()
        print("\nTest Complete!")
    except Exception as e:
        print(f"Error: {e}")
        print(f"Ensure you have port-forwarded the Kafka service: minikube kubectl -- port-forward -n kafka svc/my-cluster-kafka-external-bootstrap 9094:9094")