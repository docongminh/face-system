const admin = {
  host: "192.168.82.107",
  username: "guest",
  password: "guest",
  vhost: "/",
  port: "5672"
}

const broker = {
  exchange_name: "face_service",
  exchange_type: "direct",
  detect_queue: "DETECTION",
  match_face_queue: "MATCHING",
  response_queue: "RESPONSE",
  durable: false //https://github.com/MassTransit/MassTransit/issues/370
}
const routing_keys = {
  detect_key: "detect",
  extract_key: "extract",
  match_face_key: "matching",
  response_key: "response"
}

module.exports = {admin, broker, routing_keys}