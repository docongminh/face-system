# Face Recognition Service

# Temporary Flow
![FLOW](https://github.com/docongminh/face-recognition-microservice/blob/master/images/flow_temp.svg)

# START
Each one service below have to run on single terminal
  * Start Rabbit MQ management: 
       `~ docker-compose -f docker-compose-rabbit.yml up`
       - user & password default: `guest` & `guest`
       - If your IP is Dynamic IP. You have to check and reconfig rabbitmq host in [here](https://github.com/docongminh/consumers-face-service/blob/master/rabbitmq/config.py#L2)
  * Run server Node
      * init install dependency nodejs: 
          `~ npm i`
      * start server: 
          `~ npm start`
  * Run Consumer: 
      `~ bash consumer.sh`
# TEST POSTMAN
 - API: localhost:5000/api/v1/face
 ```json
    {
        "image": ["list base64 image"]
    }
 ```
 - OUPUT EXAMPLE:
 ```json
    {
        "code": 200,
        "detect_time": 0.07,
        "extract_time": 0.01,
        "data": {
            "0": {
                "embbeding": [],
                "bbox": []
            },
            "1": {
                "embbeding": [],
                "bbox": []
            }
            
        }
    }
 ```
# MUSTDO
  - [x] API Gateway
  - [x] Detect consumer
  - [x] Extract feature consumer test & integrate
  - [ ] Search Embeding consumer(milvus)
  - [ ] README project

# PENDING
  - [ ] Build consumer by ncnn(C++)
  - [ ] Build Extract Feature by ncnn(C++)
  - [ ] [Try Protocol Buffer](https://developers.google.com/protocol-buffers) instead of JSON
  - [ ] [Try ZMQ](https://zeromq.org/)
  - [ ] Try Kubernetes

# References
## Search Embedding
  - [faiss](https://github.com/facebookresearch/faiss)
  - [milvus](https://github.com/milvus-io/milvus)
  - [scann](https://github.com/google-research/google-research/tree/master/scann)
