let API_KEY = "AIzaSyAVFtvuebZjEx_y6TVOX-ilqy5l_GiCmJQ";
let API_URL = "https://www.googleapis.com/youtube/v3";
$(document).ready(function () {
  let vId = getParameterValues("vid");
  let cId = getParameterValues("cid");
  function getParameterValues(param) {
    let url = window.location.href
      .slice(window.location.href.indexOf("?") + 1)
      .split("&");
    for (let i = 0; i < url.length; i++) {
      let urlparam = url[i].split("=");
      if (urlparam[0] == param) {
        return urlparam[1];
      }
    }
  }
  getVideoData(vId, cId);

  function getVideoData(vId, cId) {
    $.ajax({
      type: "GET",
      url: `${API_URL}/videos`,
      data: {
        key: API_KEY,
        id: vId,
        part: "statistics,snippet",
      },
      success: function (vidData) {
        getChannelData(vidData, cId);
      },
      error: function (response) {
        console.log("Request Failed");
      },
    });
  }

  function getChannelData(vidData, cId) {
    $.ajax({
      type: "GET",
      url: `${API_URL}/channels`,
      data: {
        key: API_KEY,
        id: cId,
        part: "snippet,statistics",
      },
      success: function (channelData) {
        console.log(vidData);
        console.log(channelData);
        playVideo(vidData, channelData);
      },
      error: function (response) {
        console.log("Request Failed");
      },
    });
  }

  function playVideo(vidData, channelData) {
    //let html = ``;
    $("#iframePlayer").attr(
      "src",
      `https://www.youtube.com/embed/${vId}?autoplay=1`
    );
    $("#title").text(vidData.items[0].snippet.title);
    $("#viewCount").text(
      numberWithCommas(vidData.items[0].statistics.viewCount)
    );
    $("#publishDate").text(showDate(vidData.items[0].snippet.publishedAt));
    $("#likeCount").text(
      numberConversion(vidData.items[0].statistics.likeCount)
    );
    $("#dislikeCount").text(
      numberConversion(vidData.items[0].statistics.dislikeCount)
    );
    $("#channelThumbnail").attr(
      "src",
      channelData.items[0].snippet.thumbnails.default.url
    );

    $("#channelTitle").text(channelData.items[0].snippet.title);

    $("#subscriber").text(
      numberConversion(channelData.items[0].statistics.subscriberCount) +
        " subscribers"
    );
    $("#description").text(vidData.items[0].snippet.description);

    //$("#videoPlayer").html(html);
  }

  $("#showMore").click(function () {
    if ($("#description").hasClass("description")) {
      $("#showMore").text("SHOW LESS");
      $("#description").removeClass("description");
    } else {
      $("#showMore").text("SHOW MORE");
      $("#description").addClass("description");
    }
  });
});

function showDate(date) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  let d = new Date(date);

  return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
}

function numberWithCommas(x) {
  return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function numberConversion(n) {
  if (n >= 1000000) {
    return Math.round(n / 1000000) + "M";
  } else if (n >= 1000) {
    return Math.round(n / 1000) + "K";
  }

  return n;
}
