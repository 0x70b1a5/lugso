const halfTime = 12000;
function createFloatingDots(numDots) {
  const container = document.getElementsByClassName('dotty')[0]
  for (let i = 0; i < numDots; i++) {
    const duration = Math.random() * halfTime + halfTime;

    function dotFinished(dot) {
      dot.parentNode.removeChild(dot);
      createFloatingDot();
    }

    function createFloatingDot() {
      const dot = document.createElement("div");
      dot.className = "dot";
      dot.style.width = "0px";
      dot.style.height = "0px";
      container.appendChild(dot);

      const angle = Math.random() * Math.PI * 2;
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
      const maxDistance = Math.sqrt(vw * vw + vh * vh) / 2;
      const distance = Math.random() * maxDistance + maxDistance;
      const size = Math.random() * 5 + 2;

      setTimeout(() => {
        dot.style.transition = `all ${duration}ms ease-out`;
        dot.style.opacity = "0.5";
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;
        dot.style.transform = `translate(${distance * Math.cos(angle)}px, ${distance * Math.sin(angle)}px)`;
        setTimeout(() => dotFinished(dot), duration);
      }, 100);
    }

    createFloatingDot();
  }
}

setTimeout(() => createFloatingDots(50), 5000)
