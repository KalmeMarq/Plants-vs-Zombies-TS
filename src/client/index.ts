import Game from "./Game";
import BinaryReader from "./util/BinaryReader";
import Users from "./util/Users";

let game = new Game()
game.init()

function loop() {
  requestAnimationFrame(loop)
  game.update()
}
loop()

;(async () => {
  const res = await fetch('./assets/user_test/users.dat')
  const data = await res.arrayBuffer()

  const reader = new BinaryReader(new Uint8Array(data))
  let users = new Users('users1.dat')
  users.load(reader)
  console.log(users)
})()