// Import the data to customize and insert them into page
const fetchData = () => {
  fetch("customize.json")
    .then(data => data.json())
    .then(data => {
      dataArr = Object.keys(data)
      dataArr.map(customData => {
        if (data[customData] !== "") {
          if (customData === "imagePath") {
            document
              .querySelector(`[data-node-name*="${customData}"]`)
              .setAttribute("src", data[customData])
          } else if (customData === "fonts") {
            // 使用本地字体而不是外部链接
            document.body.style.fontFamily = 'Arial, sans-serif, "LXGWWenKai"';
          } else {
            const elements = document.querySelectorAll(`[data-node-name*="${customData}"]`);
            if (elements.length > 0) {
              elements.forEach(el => {
                el.innerText = data[customData];
              });
            }
          }
        }

        // Check if the iteration is over
        // Run amimation if so
        if (dataArr.length === dataArr.indexOf(customData) + 1) {
          document.querySelector("#startButton").addEventListener("click", () => {
            const nameInput = document.querySelector("#nameInput");
            const errorMessage = document.querySelector("#errorMessage");
            
            // 验证输入的名字是否为"胡东明"
            if (nameInput.value.trim() === "胡东明") {
              // 名字正确，隐藏错误信息并继续
              errorMessage.style.display = "none";
              
              // 播放音乐
              try {
                if (audio) {
                  audio.play();
                  isPlaying = true;
                  playPauseButton.classList.add('playing');
                }
              } catch (e) {
                console.log('自动播放被浏览器阻止，请点击播放按钮开始播放音乐', e);
              }
              
              document.querySelector(".startSign").style.display = "none";
              animationTimeline();
            } else {
              // 名字不正确，显示错误信息
              errorMessage.style.display = "block";
              nameInput.focus();
            }
          })
          // animationTimeline()
        }
      })
    })
}

// Animation Timeline
const animationTimeline = () => {
  // Spit chars that needs to be animated individually
  const textBoxChars = document.getElementsByClassName("hbd-chatbox")[0]
  const hbd = document.getElementsByClassName("wish-hbd")[0]

  textBoxChars.innerHTML = `<span>${textBoxChars.innerHTML
    .split("")
    .join("</span><span>")}</span`

  hbd.innerHTML = `<span>${hbd.innerHTML
    .split("")
    .join("</span><span>")}</span`

  const ideaTextTrans = {
    opacity: 0,
    y: -20,
    rotationX: 5,
    skewX: "15deg"
  }

  const ideaTextTransLeave = {
    opacity: 0,
    y: 20,
    rotationY: 5,
    skewX: "-15deg"
  }

  const tl = new TimelineMax()

  tl
    .to(".container", 0.1, {
      visibility: "visible"
    })
    .from(".one", 0.7, {
      opacity: 0,
      y: 10
    })
    .from(".two", 0.4, {
      opacity: 0,
      y: 10
    })
    .to(
      ".one",
      0.7,
      {
        opacity: 0,
        y: 10
      },
      "+=2.5"
    )
    .to(
      ".two",
      0.7,
      {
        opacity: 0,
        y: 10
      },
      "-=1"
    )
    .from(".three", 0.7, {
      opacity: 0,
      y: 10
      // scale: 0.7
    })
    .to(
      ".three",
      0.7,
      {
        opacity: 0,
        y: 10
      },
      "+=2"
    )
    .from(".four", 0.7, {
      scale: 0.2,
      opacity: 0
    })
    .from(".fake-btn", 0.3, {
      scale: 0.2,
      opacity: 0
    })
    .staggerTo(
      ".hbd-chatbox span",
      0.5,
      {
        visibility: "visible"
      },
      0.05
    )
    .to(".fake-btn", 0.1, {
      backgroundColor: "#8FE3B6"
    })
    .to(
      ".four",
      0.5,
      {
        scale: 0.2,
        opacity: 0,
        y: -150
      },
      "+=0.7"
    )
    .from(".idea-1", 0.7, ideaTextTrans)
    .to(".idea-1", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-2[data-node-name='text3']", 0.7, ideaTextTrans)
    .to(".idea-2[data-node-name='text3']", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-2[data-node-name='text3a']", 0.7, ideaTextTrans)
    .to(".idea-2[data-node-name='text3a']", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-2[data-node-name='text3b']", 0.7, ideaTextTrans)
    .to(".idea-2[data-node-name='text3b']", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-2[data-node-name='text3c']", 0.7, ideaTextTrans)
    .to(".idea-2[data-node-name='text3c']", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-3", 0.7, ideaTextTrans)
    .to(".idea-3 strong", 0.5, {
      scale: 1.2,
      x: 10,
      backgroundColor: "rgb(21, 161, 237)",
      color: "#fff"
    })
    .to(".idea-3", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-4", 0.7, ideaTextTrans)
    .to(".idea-4", 0.7, ideaTextTransLeave, "+=1.5")
    .from(
      ".idea-5",
      0.7,
      {
        rotationX: 15,
        rotationZ: -10,
        skewY: "-5deg",
        y: 50,
        z: 10,
        opacity: 0
      },
      "+=0.5"
    )
    .to(
      ".idea-5 .smiley",
      0.7,
      {
        rotation: 90,
        x: 8
      },
      "+=0.4"
    )
    .to(
      ".idea-5",
      0.7,
      {
        scale: 0.2,
        opacity: 0
      },
      "+=2"
    )
    .staggerFrom(
      ".idea-6 span",
      0.8,
      {
        scale: 3,
        opacity: 0,
        rotation: 15,
        ease: Expo.easeOut
      },
      0.2
    )
    .staggerTo(
      ".idea-6 span",
      0.8,
      {
        scale: 3,
        opacity: 0,
        rotation: -15,
        ease: Expo.easeOut
      },
      0.2,
      "+=1"
    )
    .staggerFromTo(
      ".baloons img",
      1.25,
      {
        opacity: 0,
        y: 1400,
        display: "inline-block" // 确保动画开始时显示
      },
      {
        opacity: 1,
        y: -1000,
        display: "inline-block"
      },
      0.1
    )
    .staggerTo(
      ".baloons img",
      0.25,
      {
        opacity: 0,
        display: "none" // 动画结束后隐藏
      },
      0.05,
      "+=1.25" // 等待气球完全上升后再隐藏
    )
    .from(
      ".lydia-dp",
      0.5,
      {
        scale: 3.5,
        opacity: 0,
        x: 25,
        y: -25,
        rotationZ: -45
      },
      "-=2"
    )
    .from(".hat", 0.5, {
      x: -100,
      y: 350,
      rotation: -180,
      opacity: 0
    })
    .staggerFrom(
      ".wish-hbd span",
      0.7,
      {
        opacity: 0,
        y: -50,
        // scale: 0.3,
        rotation: 150,
        skewX: "30deg",
        ease: Elastic.easeOut.config(1, 0.5)
      },
      0.1
    )
    .staggerFromTo(
      ".wish-hbd span",
      0.7,
      {
        scale: 1.4,
        rotationY: 150
      },
      {
        scale: 1,
        rotationY: 0,
        color: "#ff69b4",
        ease: Expo.easeOut,
        onStart: function() {
          // 在文本动画开始时触发烟花效果
          if (window.triggerFireworks) {
            window.triggerFireworks(8); // 触发8个烟花，制造更热闹的效果
          }
        }
      },
      0.1,
      "party"
    )
    .from(
      ".wish h5",
      0.5,
      {
        opacity: 0,
        y: 10,
        skewX: "-15deg"
      },
      "party"
    )
    .staggerTo(
      ".eight svg",
      1.5,
      {
        visibility: "visible",
        opacity: 0,
        scale: 80,
        repeat: 3,
        repeatDelay: 1.4
      },
      0.3
    )
    .to(".six", 0.5, {
      opacity: 0,
      y: 30,
      zIndex: "-1"
    })
    .staggerFrom(".nine p", 1, ideaTextTrans, 1.2)
    .to(
      ".last-smile",
      0.5,
      {
        rotation: 90
      },
      "+=1"
    )

  // tl.seek("currentStep");
  // tl.timeScale(2);

  // Restart Animation on click
  const replyBtn = document.getElementById("replay")
  replyBtn.addEventListener("click", () => {
    tl.restart()

  })
}

// Run fetch and animation in sequence
fetchData()

const playPauseButton = document.getElementById('playPauseButton')
const audio = document.getElementById('bgMusic')
let isPlaying = false
  
// 播放/暂停音乐的功能已整合到startButton的验证逻辑中
  
playPauseButton.addEventListener('click', () => {
  if (audio) {
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    isPlaying = !isPlaying
    playPauseButton.classList.toggle('playing', isPlaying)
  }
})