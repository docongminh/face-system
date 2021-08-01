# Face Recognition Service

# Temporary Flow
![FLOW](https://github.com/docongminh/face-recognition-microservice/blob/master/images/flow_temp.svg)

# START
Each one service below have to run on single terminal
  * Run Consumer:
      In this consumer contains: detect, extract, search/insert and all milvus service
      `~ bash consumer.sh`
  * Run server Node
      * init install dependency nodejs: 
          `~ npm i`
      * start server:
         befor start service make sure that your rabbitmq correctly. If your IP is Dynamic IP. You have to check and reconfig rabbitmq host in [here](https://github.com/docongminh/consumers-face-service/blob/master/rabbitmq/config.py#L2)
          `~ npm start`
  
# TEST POSTMAN
 - API: localhost:5000/api/v1/insert
 ```json
    {
        "name": "name indentity",
        "image": ["list base64 image"]
    }
 ```
 - OUPUT EXAMPLE:
 ```json
    {
        "code": 200,
        "time_detect": 0.5722126960754395,
        "time_extract": 0.14391565322875977,
        "entities": 2,
        "message": "Create successful !"
    }
 ```
 # Milvus Insight
     host: http://127.0.0.1:8000
     account: ip_address:19530
# MUSTDO
  - [x] API Gateway
  - [x] Detect consumer
  - [x] Extract feature consumer test & integrate
  - [x] Insert Embeding consumer(milvus)
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
