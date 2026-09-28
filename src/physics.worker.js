// 별도의 CPU 스레드에서 물리 연산 및 데이터 처리 수행
let playerX = 0;
let items = [];
let score = 0;

for (let i = 0; i < 15; i++) {
  items.push({
    x: (Math.random() - 0.5) * 20,
    y: Math.random() * 5 + 2,
    z: -Math.random() * 50 - 5,
    speed: 0.1 + Math.random() * 0.1
  });
}

self.onmessage = (e) => {
  if (e.data.type === 'MOVE') {
    playerX += e.data.dir * 0.3;
    playerX = Math.max(-8, Math.min(8, playerX));
  }
};

function physicsLoop() {
  // 아이템 이동 및 충돌 판정 (물리 루프)
  items.forEach((item) => {
    item.z += item.speed;

    // 충돌 체크 (Distance check)
    const dx = item.x - playerX;
    const dz = item.z - 0; // 플레이어 Z 위치는 0
    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance < 1.2) {
      score += 10;
      item.z = -50;
      item.x = (Math.random() - 0.5) * 20;
    }

    // 리스폰
    if (item.z > 5) {
      item.z = -50;
      item.x = (Math.random() - 0.5) * 20;
    }
  });

  // 메인 렌더링 스레드로 데이터 전송
  self.postMessage({
    type: 'UPDATE',
    playerX,
    items,
    score
  });
}

// 60Hz 물리 업데이트
setInterval(physicsLoop, 1000 / 60);
