
// TODO: This should be recatored @JohanHagaMohn

const twitterLogo = '<svg id="twitterLogo" viewBox="0 0 24 24" color="rgb(29, 161, 242)" class="r-13gxpu9 r-4qtqp9 r-yyyyoo r-1ve99a9 r-19fsva8 r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-23tnvd"><g><path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path></g></svg>';
const locationIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" class="r-9ilb82 r-4qtqp9 r-yyyyoo r-1xvli5t r-1d4mawv r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"><g><path d="M12 14.315c-2.088 0-3.787-1.698-3.787-3.786S9.913 6.74 12 6.74s3.787 1.7 3.787 3.787-1.7 3.785-3.787 3.785zm0-6.073c-1.26 0-2.287 1.026-2.287 2.287S10.74 12.814 12 12.814s2.287-1.025 2.287-2.286S13.26 8.24 12 8.24z"></path><path d="M20.692 10.69C20.692 5.9 16.792 2 12 2s-8.692 3.9-8.692 8.69c0 1.902.603 3.708 1.743 5.223l.003-.002.007.015c1.628 2.07 6.278 5.757 6.475 5.912.138.11.302.163.465.163.163 0 .327-.053.465-.162.197-.155 4.847-3.84 6.475-5.912l.007-.014.002.002c1.14-1.516 1.742-3.32 1.742-5.223zM12 20.29c-1.224-.99-4.52-3.715-5.756-5.285-.94-1.25-1.436-2.742-1.436-4.312C4.808 6.727 8.035 3.5 12 3.5s7.192 3.226 7.192 7.19c0 1.57-.497 3.062-1.436 4.313-1.236 1.57-4.532 4.294-5.756 5.285z"></path></g></svg>';
const urlIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" class="r-9ilb82 r-4qtqp9 r-yyyyoo r-1xvli5t r-1d4mawv r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"><g><path d="M11.96 14.945c-.067 0-.136-.01-.203-.027-1.13-.318-2.097-.986-2.795-1.932-.832-1.125-1.176-2.508-.968-3.893s.942-2.605 2.068-3.438l3.53-2.608c2.322-1.716 5.61-1.224 7.33 1.1.83 1.127 1.175 2.51.967 3.895s-.943 2.605-2.07 3.438l-1.48 1.094c-.333.246-.804.175-1.05-.158-.246-.334-.176-.804.158-1.05l1.48-1.095c.803-.592 1.327-1.463 1.476-2.45.148-.988-.098-1.975-.69-2.778-1.225-1.656-3.572-2.01-5.23-.784l-3.53 2.608c-.802.593-1.326 1.464-1.475 2.45-.15.99.097 1.975.69 2.778.498.675 1.187 1.15 1.992 1.377.4.114.633.528.52.928-.092.33-.394.547-.722.547z"></path><path d="M7.27 22.054c-1.61 0-3.197-.735-4.225-2.125-.832-1.127-1.176-2.51-.968-3.894s.943-2.605 2.07-3.438l1.478-1.094c.334-.245.805-.175 1.05.158s.177.804-.157 1.05l-1.48 1.095c-.803.593-1.326 1.464-1.475 2.45-.148.99.097 1.975.69 2.778 1.225 1.657 3.57 2.01 5.23.785l3.528-2.608c1.658-1.225 2.01-3.57.785-5.23-.498-.674-1.187-1.15-1.992-1.376-.4-.113-.633-.527-.52-.927.112-.4.528-.63.926-.522 1.13.318 2.096.986 2.794 1.932 1.717 2.324 1.224 5.612-1.1 7.33l-3.53 2.608c-.933.693-2.023 1.026-3.105 1.026z"></path></g></svg>'
const registeredIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" class="r-9ilb82 r-4qtqp9 r-yyyyoo r-1xvli5t r-1d4mawv r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"><g><path d="M19.708 2H4.292C3.028 2 2 3.028 2 4.292v15.416C2 20.972 3.028 22 4.292 22h15.416C20.972 22 22 20.972 22 19.708V4.292C22 3.028 20.972 2 19.708 2zm.792 17.708c0 .437-.355.792-.792.792H4.292c-.437 0-.792-.355-.792-.792V6.418c0-.437.354-.79.79-.792h15.42c.436 0 .79.355.79.79V19.71z"></path><circle cx="7.032" cy="8.75" r="1.285"></circle><circle cx="7.032" cy="13.156" r="1.285"></circle><circle cx="16.968" cy="8.75" r="1.285"></circle><circle cx="16.968" cy="13.156" r="1.285"></circle><circle cx="12" cy="8.75" r="1.285"></circle><circle cx="12" cy="13.156" r="1.285"></circle><circle cx="7.032" cy="17.486" r="1.285"></circle><circle cx="12" cy="17.486" r="1.285"></circle></g></svg>'

function imageExists(url, callback) {
    var img = new Image();
    img.onload = function() { callback(true, url); };
    img.onerror = function() { callback(false, url); };
    img.src = url;
}

function genereateImgDOM(url, fallback_url) {
  let img = new Image();
  img.onerror = () => {
    if(img.src != fallback_url) {
      img.src = fallback_url
    }
  }
  img.src = url
  img.id = "tweetProfileImage"
  return img
}

function generateTweetDOM(user) {
    let message = user.status 
    popup = document.createElement("DIV");

    const now = new Date(Date.parse(message.created_at))
    noon = now.getHours() > 11 ? "PM" : "AM";
    minutes = now.getMinutes() > 9 ? now.getMinutes() : "0" + now.getMinutes();
    let time = `${now.getHours() % 12}:${minutes} ${noon} · ${new Intl.DateTimeFormat('en-US', { month: 'short' }).format(now)}, ${now.getFullYear()}`

    var userImage = "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"

    popup.innerHTML = `
    <div id="tweetTop">
      <div id="tweetProfile">
      </div>
      <a href="https://www.twitter.com/${user.screen_name}" target="_blank" id="tweetUser">
        <h6 id="tweetUsername">${user.name}</h6>
        <h6 id="tweetTag">@${user.screen_name}</h6>
      </a>
      <div id="tweetLogo">${twitterLogo}</div>
    </div>
    <div id="tweetMessage">${message.full_text}</div>
    <div id="tweetDetails" >
      <a href="https://www.twitter.com/${user.screen_name}" target="_blank" id="tweetTime">${time}</a>
    </div >`;

    let image = genereateImgDOM(user.profile_image_url_https, userImage)

    popup.children[0].children[0].appendChild(image)
    
    return popup
}
function generateUserDOM(profile) {
    popup = document.createElement("DIV");
    const year = new Date(Date.parse(profile.created_at)).getFullYear()
      
    var userImage = "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
    imageExists(profile.profile_image_url_https, function (exists, url) {
      if (exists) {
        userImage = profile.profile_image_url_https
      }
      var userBackground = "https://www.schemecolor.com/wallpaper?i=4334&og";
      imageExists(profile.profile_background_image_url, function (exists, url) {
        if (exists) {
          userBackground = profile.profile_background_image_url;
        }
        var userUrl = "";
        if (typeof(profile.entities.url) != "undefined") {
          userUrl = `<div id="userWebsite"><div class="userIcon">${urlIcon}</div><h6>${profile.entities.url.urls[0].display_url}</h6></div>`;
        }
        
        popup.innerHTML = `<div id="userData"><img id="userBanner" src="${userBackground}"></img><div id="userProfile"><img id="userProfileImage" src="${userImage}"></img><a href="https://www.twitter.com/${profile.screen_name}" target="_blank" id="userUser"><h6 id="userUsername">${profile.name}</h6><h6 id="userTag">@${profile.screen_name}</h6></a></div><div id="description">${profile.description}</div><div id="userInfo"><div id="userLocation"><div class="userIcon">${locationIcon}</div><h6>${profile.location}</h6></div>${userUrl}<div id="userCreated"><div class="userIcon">${registeredIcon}</div><h6>${year}</h6></div></div></div>`;

      });
    });
    return popup
}