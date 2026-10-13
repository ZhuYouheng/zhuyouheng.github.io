(() => {
  "use strict";

  const video = document.getElementById("video");
  const stage = document.getElementById("stage");
  const language = document.getElementById("language");
  const fullLanguage = document.getElementById("fullLanguage");
  const captions = document.getElementById("captions");
  const caption = captions.querySelector("span");
  let nativeFullscreen = false;
  let frame = null;

  // Always start in English, including after a browser restores form values.
  function resetLanguage() {
    language.value = "en";
    fullLanguage.value = "en";
    update();
  }

  function resize() {
    const width = Math.min(video.clientWidth, video.clientHeight * 16 / 9);
    const height = width * 9 / 16;
    captions.style.bottom = ((video.clientHeight - height) / 2 + height * 0.036) + "px";
    captions.style.fontSize = Math.max(12, width * 43 / 1920) + "px";
  }

  function update() {
    const time = video.currentTime;
    const cue = language.value === "off" ? null : paperVideoCues.find(item => item.start <= time && time < item.end);
    caption.hidden = !cue;
    if (cue) {
      caption.textContent = (language.value === "zh" ? cue.zh_lines : cue.lines).join("\n");
      caption.style.color = cue.color;
    } else {
      caption.textContent = "";
    }
  }

  function tick() {
    update();
    frame = !video.paused && !video.ended ? requestAnimationFrame(tick) : null;
  }

  function stopTick() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    update();
  }

  // The page renders its own colored subtitles; suppress in-band duplicates.
  function disableNativeSubtitles() {
    for (const track of video.textTracks) track.mode = "disabled";
  }
  video.textTracks.addEventListener("addtrack", disableNativeSubtitles);
  video.addEventListener("loadedmetadata", () => { disableNativeSubtitles(); resize(); update(); });
  video.addEventListener("play", () => { if (frame === null) tick(); });
  video.addEventListener("pause", stopTick);
  video.addEventListener("ended", stopTick);
  video.addEventListener("timeupdate", update);
  video.addEventListener("seeked", update);
  video.addEventListener("error", () => { document.getElementById("video-error").hidden = false; });

  language.addEventListener("change", () => { fullLanguage.value = language.value; update(); });
  fullLanguage.addEventListener("change", () => { language.value = fullLanguage.value; update(); });

  async function exitFullscreen() {
    stage.classList.remove("expanded");
    if (document.fullscreenElement === stage) await document.exitFullscreen().catch(() => {});
    nativeFullscreen = false;
    resize();
    update();
    document.getElementById("fullscreen").focus();
  }

  document.getElementById("fullscreen").addEventListener("click", async () => {
    stage.classList.add("expanded");
    resize();
    if (stage.requestFullscreen) {
      try { await stage.requestFullscreen(); nativeFullscreen = true; } catch (_) { nativeFullscreen = false; }
    }
    fullLanguage.focus();
  });
  document.getElementById("exitFullscreen").addEventListener("click", exitFullscreen);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && stage.classList.contains("expanded")) exitFullscreen();
  });
  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement && nativeFullscreen) {
      nativeFullscreen = false;
      stage.classList.remove("expanded");
    }
    resize();
    update();
  });
  window.addEventListener("resize", resize);
  if (window.ResizeObserver) new ResizeObserver(resize).observe(video);
  window.addEventListener("pageshow", resetLanguage);
  disableNativeSubtitles();
  resetLanguage();
  resize();
})();
