// Import the data to customize and insert them into page
const fetchData = () => {
  fetch("customize.json?ts=" + Date.now(), { cache: 'no-store' })
    .then(data => data.json())
    .then(data => {
      dataArr = Object.keys(data)
      dataArr.map(customData => {
        if (data[customData] !== "") {
          if (customData === "imagePath") {
            const el = document.querySelector(`[data-node-name*="${customData}"]`)
            if (el) {
              const imgSrc = data[customData]
              const bustSrc = imgSrc + (imgSrc.includes('?') ? '&' : '?') + 'ts=' + Date.now()
              el.setAttribute("src", bustSrc)
            }
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
            // 新增：错误尝试计数与破碎标记
            window.__failedAttempts = window.__failedAttempts || 0;
            window.__isShattered = window.__isShattered || false;
            
            if (window.__isShattered) {
              return; // 已破碎后阻止任何交互
            }
            
            // 验证输入的名字是否为"胡东明"
            if (nameInput.value.trim() === "范天丹") {
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
              // 展示地图供你设置终点，设置后点击“开始”播放
              {
                const overlayEl = document.getElementById('mapArrival');
                if (overlayEl) {
                  overlayEl.style.display = 'flex';
                  requestAnimationFrame(() => {
                    initMapIfNeeded();
                    startMapAnimation();
                  });
                }
              }
              // 注意：不再在这里直接启动 animationTimeline，改为在地图到达后启动
            } else {
              // 名字不正确逻辑：显示错误并统计尝试次数
              window.__failedAttempts += 1;
              const remaining = Math.max(0, 3 - window.__failedAttempts);
              errorMessage.textContent = `名字不正确，请重试（还剩${remaining}次机会）`;
              errorMessage.style.display = "block";
              nameInput.focus();
              
              // 第三次错误：触发整页破碎并停止后续展示
              if (window.__failedAttempts >= 3) {
                triggerShatterEffect();
              }
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
    // 原先这里是一次性逐个展示 nine 区块中的所有 <p>
    // .staggerFrom(".nine p:not(.story-paragraph)", 1, ideaTextTrans, 1.2)
    // 改为：先展示 outroText，然后让 #replay 和 .map-button 同时出现，最后展示 last-smile
    .from(".nine [data-node-name='outroText']", 1, ideaTextTrans)
    .from(".nine #replay", 1, ideaTextTrans)
    .from(".nine .map-button", 1, ideaTextTrans, "-=1")
    .from(".nine .last-smile", 1, ideaTextTrans, "+=0.6")
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
    // 展示并居中故事框
    TweenMax.set(".story-box", { display: "block" })
    const box = document.querySelector('.story-box')
    if (box) {
      box.classList.add('story-center')
    }
    // 清理旧动画，确保可重复播放
    TweenMax.killTweensOf('.story-paragraph')
    TweenMax.set('.story-paragraph', { clearProps: 'all' })
    // 逐条入场动画（显式 fromTo，避免受历史内联样式影响）
    TweenMax.staggerFromTo(
      ".story-paragraph",
      0.8,
      { opacity: 0, y: 20, rotationX: 5, skewX: "15deg" },
      { opacity: 1, y: 0, rotationX: 0, skewX: 0 },
      0.25
    )
  })

  // 关闭按钮事件
  const closeBtn = document.querySelector('.story-close')
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      // 停止并清理动画
      TweenMax.killTweensOf('.story-paragraph')
      TweenMax.set('.story-paragraph', { clearProps: 'all' })
      // 隐藏故事框并移除居中样式
      TweenMax.set('.story-box', { display: 'none' })
      const box2 = document.querySelector('.story-box')
      if (box2) {
        box2.classList.remove('story-center')
      }
    })
  }
}

// Run fetch and animation in sequence
fetchData()

const playPauseButton = document.getElementById('playPauseButton')
const audio = document.getElementById('bgMusic')
let isPlaying = false

// 当音乐播放自然结束时，3秒后自动重新播放
if (audio) {
  audio.addEventListener('ended', () => {
    // 更新按钮状态为未播放
    isPlaying = false
    playPauseButton.classList.remove('playing')
    // 3秒后重播（如果期间用户没有手动播放）
    setTimeout(() => {
      if (!isPlaying) {
        audio.currentTime = 0
        audio.play()
          .then(() => {
            isPlaying = true
            playPauseButton.classList.add('playing')
          })
          .catch(e => {
            console.log('自动重播被阻止或失败：', e)
          })
      }
    }, 3000)
  })
}
  
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


// 地图到达界面逻辑
let mapInstance = null;
let routeLine = null;
let marker = null;
let destMarker = null; // 自定义终点标记
let customEndLatLng = null; // 自定义终点（WGS84）
let distanceInfoEl = null; // 距离显示元素

const showMapBtn = document.getElementById('showMap');
const mapOverlay = document.getElementById('mapArrival');
const mapCloseBtn = document.querySelector('.map-close');
// const mapStartBtn = document.getElementById('mapStart'); // 已移除按钮

// 新增：封装地图初始化与动画函数
function initMapIfNeeded() {
  if (!mapInstance && window.L) {
    mapInstance = L.map('map', { zoomControl: true });
    // 记录距离显示元素
    distanceInfoEl = document.getElementById('distanceInfo');
    // 视网膜清晰度与降级回退（高德道路）
    const isRetina = (window.devicePixelRatio || 1) > 1.3;
    function makeGaodeRoad(scale) {
      return L.tileLayer(`https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=${scale}&style=7&x={x}&y={y}&z={z}`, {
        subdomains: '1234',
        attribution: '© 高德地图（GCJ-02）',
        maxZoom: 19,
        maxNativeZoom: 18,
        updateWhenIdle: true,
        crossOrigin: true
      });
    }
    let roadTiles = makeGaodeRoad(isRetina ? 2 : 1);
    // 默认不添加道路底图；优先使用卫星 + 注记
    const fallbackRoadOnError = () => {
      roadTiles.off('tileerror', fallbackRoadOnError);
      mapInstance.removeLayer(roadTiles);
      roadTiles = makeGaodeRoad(1);
      // 保持可切换，但不主动添加到地图
      // roadTiles.addTo(mapInstance);
    };
    roadTiles.on('tileerror', fallbackRoadOnError);

    // 高德卫星（叠加注记）
    function makeGaodeSat(scale) {
      return L.tileLayer(`https://webst0{s}.is.autonavi.com/appmaptile?size=1&scale=${scale}&style=6&x={x}&y={y}&z={z}`, {
        subdomains: '1234',
        attribution: '© 高德地图卫星（GCJ-02）',
        maxZoom: 19,
        maxNativeZoom: 18,
        updateWhenIdle: true,
        crossOrigin: true
      });
    }
    function makeGaodeLabel(scale) {
      return L.tileLayer(`https://webst0{s}.is.autonavi.com/appmaptile?size=1&scale=${scale}&style=8&x={x}&y={y}&z={z}`, {
        subdomains: '1234',
        attribution: '',
        maxZoom: 19,
        maxNativeZoom: 18,
        updateWhenIdle: true,
        crossOrigin: true
      });
    }
    let satTiles = makeGaodeSat(isRetina ? 2 : 1);
    let labelTiles = makeGaodeLabel(isRetina ? 2 : 1);
    const satGroup = L.layerGroup([satTiles, labelTiles]);
    const fallbackSatOnError = (e) => {
      satTiles.off('tileerror', fallbackSatOnError);
      labelTiles.off('tileerror', fallbackSatOnError);
      satGroup.removeLayer(satTiles);
      satGroup.removeLayer(labelTiles);
      satTiles = makeGaodeSat(1);
      labelTiles = makeGaodeLabel(1);
      satGroup.addLayer(satTiles);
      satGroup.addLayer(labelTiles);
    };
    satTiles.on('tileerror', fallbackSatOnError);
    labelTiles.on('tileerror', fallbackSatOnError);
    // 默认底图改为卫星 + 注记
    satGroup.addTo(mapInstance);

    // 坐标来源：使用 WGS84 原始坐标并在初始化时转换为 GCJ-02
    const COORD_SOURCE = 'wgs';
    const jsRaw = [31.299379, 120.619585]; // 苏州（WGS84） [lat, lng]
    const cqRaw = [29.425211, 106.28012];  // 默认终点（WGS84） [lat, lng]

    let js = jsRaw;
    let defaultEnd = cqRaw;
    if (COORD_SOURCE === 'wgs') {
      const [jsLat, jsLng] = wgs84ToGcj02(jsRaw[1], jsRaw[0]);
      const [cqLat, cqLng] = wgs84ToGcj02(cqRaw[1], cqRaw[0]);
      js = [jsLat, jsLng];
      defaultEnd = [cqLat, cqLng];
    }

    // 用户提供的终点（GCJ-02），直接使用
    const userEndGcj = [29.425080, 106.308790]; // [lat, lng] GCJ-02
    customEndLatLng = userEndGcj;
    try { localStorage.setItem('customEndLatLng_gcj', JSON.stringify(customEndLatLng)); } catch (e) {}

    const endPoint = customEndLatLng || defaultEnd;

    // 创建美化后的路线与标记（与GCJ-02底图对齐）
    // 使用心形路径生成路线点
    // const heartPts = buildHeartPath(js, endPoint, 240);
    // 发光层（下层）
    // L.polyline(heartPts, { color: '#ff6b6b', weight: 10, opacity: 0.25, className: 'route-glow' }).addTo(mapInstance);
    // 主线（中层）
    // routeLine = L.polyline(heartPts, { color: '#ff6b6b', weight: 4, className: 'route-line' }).addTo(mapInstance);
    // 动态虚线（上层）
    // L.polyline(heartPts, { color: '#ffffff', weight: 2, opacity: 0.9, className: 'route-dash' }).addTo(mapInstance);
    // 改为直线路径
    L.polyline([js, endPoint], { color: '#ff6b6b', weight: 10, opacity: 0.25, className: 'route-glow' }).addTo(mapInstance);
    routeLine = L.polyline([js, endPoint], { color: '#ff6b6b', weight: 4, className: 'route-line' }).addTo(mapInstance);
    L.polyline([js, endPoint], { color: '#ffffff', weight: 2, opacity: 0.9, className: 'route-dash' }).addTo(mapInstance);

    mapInstance.fitBounds(routeLine.getBounds(), { padding: [24, 24] });

    // 移动标记：使用心形图标（强制使用彩色表情字体并居中）
    const heartIcon = L.divIcon({
      className: 'heart-marker',
      html: '<span class="heart-icon">❤️</span>',
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
    marker = L.marker(js, { icon: heartIcon }).addTo(mapInstance).bindPopup('江苏·苏州市').openPopup();

    // 终点标记：脉冲圆
    if (customEndLatLng) {
      destMarker = L.circleMarker(customEndLatLng, { radius: 8, color: '#ffffff', weight: 2, fillColor: '#ff6b6b', fillOpacity: 1, className: 'dest-pulse' })
        .addTo(mapInstance)
        .bindPopup('自选终点');
    }

    // 单击设置终点
    mapInstance.on('click', (e) => {
      setCustomEndpoint(e.latlng);
    });

    // 初始化后强制刷新尺寸，避免容器初始尺寸为0
    setTimeout(() => { if (mapInstance) mapInstance.invalidateSize(); }, 0);
    // 自动开始到达动画
    startMapAnimation();
  } else if (mapInstance) {
    setTimeout(() => { mapInstance.invalidateSize(); }, 0);
  }
}

function startMapAnimation(onArrive) {
  if (!window.L || !marker || !routeLine) return;
  const [start, end] = routeLine.getLatLngs();
  const steps = 500; // 动画步数（10秒 = 500 * 20ms）
  let t = 0;

  // 计算总距离（公里）
  const totalDistKm = haversineDistance(start.lat, start.lng, end.lat, end.lng);
  if (distanceInfoEl) {
    distanceInfoEl.textContent = `总距离：${totalDistKm.toFixed(2)} km，剩余：${totalDistKm.toFixed(2)} km`;
  }

  const timer = setInterval(() => {
    t += 1;
    const p = Math.min(t / steps, 1);
    const lat = start.lat + (end.lat - start.lat) * p;
    const lng = start.lng + (end.lng - start.lng) * p;
    marker.setLatLng([lat, lng]);

    // 更新剩余距离
    if (distanceInfoEl) {
      const remainingKm = Math.max(totalDistKm * (1 - p), 0);
      distanceInfoEl.textContent = `总距离：${totalDistKm.toFixed(2)} km，剩余：${remainingKm.toFixed(2)} km`;
    }

    if (t === 1) {
      marker.unbindPopup();
    }
    if (t >= steps) {
      clearInterval(timer);
      marker.bindPopup('已到达目的地！').openPopup();
      if (distanceInfoEl) {
        distanceInfoEl.textContent = `总距离：${totalDistKm.toFixed(2)} km，剩余：0.00 km`;
      }
      try { if (window.triggerFireworks) { window.triggerFireworks(6); } } catch (e) {}
      if (mapInstance) {
        mapInstance.flyTo([end.lat, end.lng], 18, { duration: 1.5 });
        if (typeof onArrive === 'function') {
          mapInstance.once('moveend', () => { onArrive(); });
        }
      }
    }
  }, 20);
}

if (showMapBtn && mapOverlay) {
  showMapBtn.addEventListener('click', () => {
    mapOverlay.style.display = 'flex';
    requestAnimationFrame(() => {
      initMapIfNeeded();
      // 已移除这里的 startMapAnimation 调用，避免与初始化重复触发
    });
  });
}

if (mapCloseBtn && mapOverlay) {
  mapCloseBtn.addEventListener('click', () => {
    mapOverlay.style.display = 'none';
    animationTimeline();
  });
}
// 删除 mapStartBtn 事件：改为自动启动
// if (mapStartBtn) {
//   mapStartBtn.addEventListener('click', () => {
//     startMapAnimation();
//   });
// }
// 坐标系转换：GCJ-02 -> WGS84（用于与OpenStreetMap对齐）
const _PI = Math.PI;
const _A = 6378245.0;
const _EE = 0.00669342162296594323;
function _outOfChina(lng, lat) {
  return (lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271);
}
function _transformLat(x, y) {
  let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
  ret += (20.0 * Math.sin(6.0 * x * _PI) + 20.0 * Math.sin(2.0 * x * _PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(y * _PI) + 40.0 * Math.sin(y / 3.0 * _PI)) * 2.0 / 3.0;
  ret += (160.0 * Math.sin(y / 12.0 * _PI) + 320.0 * Math.sin(y * _PI / 30.0)) * 2.0 / 3.0;
  return ret;
}
function _transformLng(x, y) {
  let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
  ret += (20.0 * Math.sin(6.0 * x * _PI) + 20.0 * Math.sin(2.0 * x * _PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(x * _PI) + 40.0 * Math.sin(x / 3.0 * _PI)) * 2.0 / 3.0;
  ret += (150.0 * Math.sin(x / 12.0 * _PI) + 300.0 * Math.sin(x / 30.0 * _PI)) * 2.0 / 3.0;
  return ret;
}
function gcj02ToWgs84(lng, lat) {
  if (_outOfChina(lng, lat)) return [lat, lng];
  let dLat = _transformLat(lng - 105.0, lat - 35.0);
  let dLng = _transformLng(lng - 105.0, lat - 35.0);
  const radLat = lat / 180.0 * _PI;
  let magic = Math.sin(radLat);
  magic = 1 - _EE * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / ((_A * (1 - _EE)) / (magic * sqrtMagic) * _PI);
  dLng = (dLng * 180.0) / (_A / sqrtMagic * Math.cos(radLat) * _PI);
  const mgLat = lat + dLat;
  const mgLng = lng + dLng;
  return [lat * 2 - mgLat, lng * 2 - mgLng]; // 返回 [lat, lng]
}
// 新增：WGS84 -> GCJ-02（用于与高德/腾讯底图对齐）
function wgs84ToGcj02(lng, lat) {
  if (_outOfChina(lng, lat)) return [lat, lng];
  let dLat = _transformLat(lng - 105.0, lat - 35.0);
  let dLng = _transformLng(lng - 105.0, lat - 35.0);
  const radLat = lat / 180.0 * _PI;
  let magic = Math.sin(radLat);
  magic = 1 - _EE * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / ((_A * (1 - _EE)) / (magic * sqrtMagic) * _PI);
  dLng = (dLng * 180.0) / (_A / sqrtMagic * Math.cos(radLat) * _PI);
  const mgLat = lat + dLat;
  const mgLng = lng + dLng;
  return [mgLat, mgLng]; // 返回 [lat, lng]
}

// 计算两点球面距离（公里）
function haversineDistance(lat1, lng1, lat2, lng2) {
  const toRad = (d) => d * Math.PI / 180;
  const R = 6371; // 地球半径 km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// 生成心形路径（锚定起点与终点的左右两端）
function buildHeartPath(startLatLng, endLatLng, numPoints = 240) {
  const start = L.latLng(startLatLng);
  const end = L.latLng(endLatLng);
  const center = L.latLng((start.lat + end.lat) / 2, (start.lng + end.lng) / 2);
  const vx = end.lng - start.lng;
  const vy = end.lat - start.lat;
  const Llen = Math.sqrt(vx * vx + vy * vy) || 1e-6;
  const nx = vx / Llen;
  const ny = vy / Llen;
  const px = -ny; // 垂直
  const py = nx;
  const scale = (Llen / (2 * 16)); // 使 +/-16 对应左右端点
  const heightRatio = 0.85; // 调整心形高度
  const pts = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = -Math.PI / 2 - (Math.PI * i) / numPoints; // 从左端经过底部到右端
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    const X = scale * x;
    const Y = scale * y * heightRatio;
    const lat = center.lat + X * ny + Y * py;
    const lng = center.lng + X * nx + Y * px;
    pts.push([lat, lng]);
  }
  // 保证首尾精确等于起终点
  pts[0] = [start.lat, start.lng];
  pts[pts.length - 1] = [end.lat, end.lng];
  return pts;
}

// 途经市区标注（WGS84 -> GCJ-02 转换后绘制）
function addCityMarkers(map) {
  const citiesWGS = [
    { name: '南京市区', lat: 32.0603, lng: 118.7969 },
    { name: '合肥市区', lat: 31.8206, lng: 117.2272 },
    { name: '武汉市区', lat: 30.5928, lng: 114.3055 },
    { name: '宜昌市区', lat: 30.6919, lng: 111.2860 },
    { name: '重庆主城', lat: 29.5630, lng: 106.5516 }
  ];
  citiesWGS.forEach(c => {
    const [latGcj, lngGcj] = wgs84ToGcj02(c.lng, c.lat);
    L.circle([latGcj, lngGcj], {
      radius: 8000,
      color: '#3388ff',
      weight: 2,
      fillColor: '#66b3ff',
      fillOpacity: 0.2
    }).addTo(map).bindTooltip(c.name, { permanent: false, direction: 'top' });
    L.marker([latGcj, lngGcj]).addTo(map).bindPopup(c.name);
  });
}

// 三次错误后破碎逻辑增强：闪白、震动、裂纹与更真实碎片
function triggerShatterEffect() {
  // 防重复触发
  if (window.__isShattered) return;
  window.__isShattered = true;

  try {
    const audio = document.getElementById('bgMusic');
    if (audio) { audio.pause(); }
  } catch (e) {}

  // 隐藏页面主要内容
  const appRoot = document.body;
  const allMain = document.querySelectorAll('body > *:not(.shatter-overlay)');
  allMain.forEach(el => {
    el.style.transition = 'opacity 300ms ease-out';
    el.style.opacity = '0';
    el.style.pointerEvents = 'none';
  });

  // 保持静止，不使用抖动效果（恢复第一次破碎方案）

  // 创建覆盖层
  const overlay = document.createElement('div');
  overlay.className = 'shatter-overlay';
  appRoot.appendChild(overlay);

  // 不再使用闪白效果（恢复第一次破碎方案）

  // 不再使用裂纹SVG（恢复第一次破碎方案）

  // 提示信息
  const message = document.createElement('div');
  message.className = 'shatter-message';
  message.textContent = '希望你开开心心的就好啦';
  overlay.appendChild(message);

  // 生成随机碎片（恢复第一次破碎方案）
  const shardCount = 40; // 增加数量并改为中心爆散
  for (let i = 0; i < shardCount; i++) {
    const shard = document.createElement('div');
    shard.className = 'shard';
  
    // 初始位置：屏幕中心
    shard.style.left = '50%';
    shard.style.top = '50%';
  
    // 爆散方向与距离（中心向外）
    const angle = Math.random() * Math.PI * 2;
    const distVw = 70 + Math.random() * 90; // 70–160vw
    const distVh = 70 + Math.random() * 90; // 70–160vh
    const tx = Math.cos(angle) * distVw;
    const ty = Math.sin(angle) * distVh;
    shard.style.setProperty('--tx', tx + 'vw');
    shard.style.setProperty('--ty', ty + 'vh');
  
    // 随机旋转
    const rot = (Math.random() * 2 - 1) * 200;
    shard.style.setProperty('--rot', rot + 'deg');
  
    // 尺寸更小，碎片更多
    shard.style.width = Math.round(4 + Math.random() * 10) + 'vw';
    shard.style.height = Math.round(4 + Math.random() * 10) + 'vh';
  
    // 轻微高光角度（用于线性渐变模拟玻璃反射）
    shard.style.setProperty('--ang', Math.round(Math.random() * 360) + 'deg');
  
    // 不规则形状：随机三角/四边形（更像玻璃碎片）
    const p1 = `${Math.round(Math.random() * 60)}% ${Math.round(Math.random() * 20)}%`;
    const p2 = `${Math.round(40 + Math.random() * 60)}% ${Math.round(Math.random() * 60)}%`;
    const p3 = `${Math.round(Math.random() * 40)}% ${Math.round(40 + Math.random() * 60)}%`;
    if (Math.random() > 0.6) {
      const p4 = `${Math.round(20 + Math.random() * 60)}% ${Math.round(Math.random() * 40)}%`;
      shard.style.clipPath = `polygon(${p1}, ${p2}, ${p3}, ${p4})`;
    } else {
      shard.style.clipPath = `polygon(${p1}, ${p2}, ${p3})`;
    }
  
    overlay.appendChild(shard);
  }
}

// 在原错误处理处调用 triggerShatterEffect（保持已存在计数逻辑）
// 确保第三次错误时执行：
// if (window.__failedAttempts >= 3 && !window.__isShattered) { triggerShatterEffect(); }
// 移除重复的破碎覆盖层创建块，统一由 triggerShatterEffect 控制

// 生成整页网格碎片并爆散（覆盖全屏）
// 已移动到 triggerShatterEffect 内部实现整页碎片生成，删除多余的外部重复代码。