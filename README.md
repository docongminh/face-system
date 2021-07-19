# Face Recognition Service

# Temporary Flow
![FLOW](https://github.com/docongminh/face-recognition-microservice/blob/master/images/flow_temp.svg)

# START
Each one service below have to run on single terminal
  * Start Rabbit MQ management: 
       `~ docker-compose -f docker-compose-rabbit.yml up`
  * Run server Node
      * init install dependency nodejs: 
          `~ npm i`
      * start server: 
          `~ npm start`
  * Run Consumer: 
      `~ bash consumer.sh`
# MUSTDO
  - [x] API Gateway
  - [x] Detect consumer
  - [ ] Extract feature consumer test & integrate
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
