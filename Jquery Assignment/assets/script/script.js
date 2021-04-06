let API_KEY = "AIzaSyAVFtvuebZjEx_y6TVOX-ilqy5l_GiCmJQ";
let API_URL = "https://www.googleapis.com/youtube/v3";
let searchQuery = "";
$(document).ready(function () {
  function home(query = "") {
    searchQuery = query;
    $.ajax({
      type: "GET",
      url: `${API_URL}/search`,
      data: {
        key: API_KEY,
        q: query,
        regionCode: "IN",
        part: "snippet",
        maxResults: 10,
        relevanceLanguage: "hi",
        type: "video",
        videoSyndicated: true,
        videoEmbeddable: true,
      },
      success: function (data) {
        let vidIdArray = data.items
          .map(function (item) {
            return item.id.videoId;
          })
          .join(",");

        let channelIdArray = data.items
          .map(function (item) {
            return item.snippet.channelId;
          })
          .join(",");
        //console.log(data.items);
        getVideoData(data, vidIdArray, channelIdArray);
      },
      error: function (response) {
        console.log(response.responseJSON.error.errors[0].reason);
      },
    });
  } // end home()

  home(); // function Call

  function getVideoData(searchDataSnippet, vidIdArray, channelIdArray) {
    $.ajax({
      type: "GET",
      url: `${API_URL}/videos`,
      data: {
        key: API_KEY,
        id: vidIdArray,
        part: "statistics,snippet,contentDetails",
      },
      success: function (vidData) {
        getChannelData(searchDataSnippet, vidData, channelIdArray);
      },
      error: function (response) {
        console.log("Request Failed");
      },
    });
  }

  function getChannelData(searchDataSnippet, vidData, channelIdArray) {
    $.ajax({
      type: "GET",
      url: `${API_URL}/channels`,
      data: {
        key: API_KEY,
        id: channelIdArray,
        part: "snippet",
      },
      success: function (channelData) {
        console.log(channelData);
        let temp = mapping(searchDataSnippet.items, channelData.items);
        if (searchQuery) {
          if (screen.width <= 1024) {
            showCards(temp, vidData);
          }
          showSearchResults(temp, vidData);
        } else {
          showCards(temp, vidData);
        }
      },
      error: function (response) {
        console.log("Request Failed");
      },
    });
  }

  function showCards(data, videoInfo) {
    //$("#videoCards").empty();
    for (let i = 0; i < data.length; i++) {
      let cardHtml = `<div  class="w-23 width-var  mb-2 mx-md-2 ">
    <div class="card border-0 text-dark">
    <a href="playvideo.html?vid=${data[i].search.id.videoId}&cid=${
        data[i].search.snippet.channelId
      }" class="stretched-link"></a>
      <img
        class="card-img"
        src="${data[i].search.snippet.thumbnails.high.url}"

        alt="..."
      />
      <div class="align-end text-white">
        <span class="card-text bg-dark">${convertDuration(
          videoInfo.items[i].contentDetails.duration
        )}</span>
      </div>
    </div>
    <div class="card-body p-0">
      <div class="row">
        <div class="col-2">
          <img
            class="border-round"
            src="${data[i].channel.snippet.thumbnails.default.url}"
            alt=""
          />
        </div>
        <div class="col-9 col-xl-8 p-0">
          <h6 class="mb-0 block-with-text f-14">
          ${data[i].search.snippet.title}
          </h6>
          <a href="playvideo.html?vid=${data[i].search.id.videoId}&cid=${
        data[i].search.snippet.channelId
      }" class="stretched-link"></a>
          <p class="text-muted mb-0 f-12 title-display">
            ${data[i].search.snippet.channelTitle}
          </p>
          <p class="text-muted word-nowarp f-12 view-display"> ${viewsConversion(
            videoInfo.items[i].statistics.viewCount
          )} • ${timeDifference(data[i].search.snippet.publishTime)}</p>
        </div>
        <div class="col-1 text-right px-0 more-icon-display">
          <i class="fas fa-ellipsis-v more-icon"></i>
        </div>
      </div>
    </div>
  </div>`;

      $("#videoCards").append(cardHtml);
    }
  }

  function showSearchResults(data, videoInfo) {
    $("#searchVideoCards").empty();
    for (let i = 0; i < data.length; i++) {
      let cardHtml = ` <div  class="row"  >
      <div class="ml-5 col-xl-4">
        <img
          class="thumbnail-img"
          src="${videoInfo.items[i].snippet.thumbnails.standard.url}"
          alt=""
        />
        <a href="playvideo.html?vid=${data[i].search.id.videoId}&cid=${
        data[i].search.snippet.channelId
      }" class="stretched-link"></a>
        <div class="align-duration text-white">
          <span class="card-text bg-dark">${convertDuration(
            videoInfo.items[i].contentDetails.duration
          )}</span>
        </div>
      </div>
      <div class="col-xl-7 pl-0 pt-1">
      <a href="playvideo.html?vid=${data[i].search.id.videoId}&cid=${
        data[i].search.snippet.channelId
      }" class="stretched-link"></a>
        <h5 class="mb-0">
        ${data[i].search.snippet.title}
        </h5>
        <p class="pt-0 mt-0 text-muted text-small f-15">
        ${viewsConversion(
          videoInfo.items[i].statistics.viewCount
        )} •  ${timeDifference(data[i].search.snippet.publishTime)}
        </p>
        <div>
          <img
            class="border-round"
            src="${data[i].channel.snippet.thumbnails.default.url}"
            alt=""
          />

          <span class="text-muted ml-2 f-15">  ${
            data[i].search.snippet.channelTitle
          }</span>
        </div>
        <p class="block-with-text mt-3">
        ${data[i].search.snippet.description}
        </p>
      </div>

    </div>`;

      $("#searchVideoCards").append(cardHtml);
    }
  }

  $("#searchBtn").click(function () {
    $("#videoCards").css("display", "none");
    let input = $("#searchInput").val();
    if (input) {
      home(input);
    }
  });

  $("#youtube-logo").click(function () {
    $("#searchVideoCards").css("display", "none");
    $("#videoCards").css("display", "flex");
    home();
  });

  $("#mobileSearchIcon").click(function () {
    $("#mobSearchHeader").css("display", "none");
    $("#mobSearchBar").css("display", "flex");
  });

  $("#mobBackIcon").click(function () {
    $("#mobSearchHeader").css("display", "flex");
    $("#mobSearchBar").css("display", "none");
  });

  $("#mobSearchIcon").click(function () {
    let input = $("#mobSearchInput").val();
    $("#videoCards").empty();
    home(input);
  });
});

function timeDifference(previousDate) {
  let current = new Date();
  let previous = new Date(previousDate);
  let msPerMinute = 60 * 1000;
  let msPerHour = msPerMinute * 60;
  let msPerDay = msPerHour * 24;
  let msPerMonth = msPerDay * 30;
  let msPerYear = msPerDay * 365;

  let elapsed = current - previous;

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + " seconds ago";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + " minutes ago";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + " hours ago";
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + " day ago";
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + " month ago";
  } else {
    return Math.round(elapsed / msPerYear) + " year ago";
  }
}

function viewsConversion(views) {
  if (views >= 1000000) {
    return Math.round(views / 1000000) + "M views";
  } else if (views >= 1000) {
    return Math.round(views / 1000) + "K views";
  }

  return views + " views";
}
function convertDuration(yt_duration) {
  let duration = "";
  const time_extractor = /([0-9]*H)?([0-9]*M)?([0-9]*S)?$/;
  const extracted = time_extractor.exec(yt_duration);
  let time = [];
  for (let i = 1; i < 4; i++) {
    time.push(parseInt(extracted[i], 10) || 0);
  }

  if (time[0]) {
    duration = time[0] + ":";
  }
  if (time[2] < 10) time[2] = "0" + time[2];
  duration += time[1] + ":" + time[2];

  return duration;
}

function mapping(se, ch) {
  let temp = [];
  let searchTemp = se.map(function (item) {
    let channelTemp = ch.filter(function (element) {
      if (item.snippet.channelId == element.id) {
        return true;
      }
    });
    let obj = {};
    obj.search = item;
    obj.channel = channelTemp[0];
    temp.push(obj);
  });
  return temp;
}
