import React, { useEffect, useState } from "react";
import "./PlayVideo.css";
import Video1 from "../../assets/video.mp4";
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import share from "../../assets/share.png";
import save from "../../assets/save.png";
import jack from "../../assets/jack.png";
import user_profile from "../../assets/user_profile.jpg";
import { API_KEY, value_converter } from "../../Data";
import moment from "moment";
import { useParams } from "react-router-dom";

const PlayVideo = () => {
  const { videoId } = useParams();

  const [apidata, setapidata] = useState(null);
  const [channelData, setchannelData] = useState(null);
  const [commentData, setcommentData] = useState([]);

  const fetchVideodata = async () => {
    //Fetching video data
    const videoDetails_url = ` https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY} 
`;
    await fetch(videoDetails_url)
      .then((res) => res.json())
      .then((data) => setapidata(data.items[0]));
  };

  const fetchOtherData = async () => {
    //fetching channel data
    const channelDetails_url = ` https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apidata.snippet.channelId}&key=${API_KEY}
`;
    await fetch(channelDetails_url)
      .then((res) => res.json())
      .then((data) => setchannelData(data.items[0]));

    //fetching comments data
    const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${API_KEY}
`;
    await fetch(comment_url)
      .then((res) => res.json())
      .then((data) => setcommentData(data.items));
  };

  useEffect(() => {
    fetchVideodata();
  }, [videoId]);

  useEffect(() => {
    fetchOtherData();
  }, [apidata]);

  return (
    <div className="play-video">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
      <h3>{apidata ? apidata.snippet.title : "title here"}</h3>

      <div className="play-video-info">
        <p>
          {apidata ? value_converter(apidata.statistics.viewCount) : "16k"}{" "}
          &bull; {apidata ? moment(apidata.snippet.publishedAt).fromNow() : ""}
        </p>
        <div>
          <span>
            <img src={like} alt="" />
            {apidata ? apidata.statistics.likeCount : 155}
          </span>
          <span>
            <img src={dislike} alt="" />
            {apidata ? apidata.statistics.dislikeCount : 155}
          </span>
          <span>
            <img src={share} alt="" />
            Share
          </span>
          <span>
            <img src={save} alt="" />
            Save
          </span>
        </div>
      </div>
      <hr />
      <div className="publisher">
        <img
          src={channelData ? channelData.snippet.thumbnails.default.url : ""}
          alt=""
        />
        <div>
          <p>{apidata ? apidata.snippet.channelTitle : ""}</p>
          <span>
            {value_converter(
              channelData ? channelData.statistics.subscriberCount : "0"
            )}{" "}
            Subscribers
          </span>
        </div>
        <button>Subscribe</button>
      </div>
      <div className="video-discribtion">
        <p>{apidata ? apidata.snippet.description.slice(0, 250) : ""}</p>
        <hr />
        <h4>
          {value_converter(apidata ? apidata.statistics.commentCount : "0")}{" "}
          Comments
        </h4>
        {commentData.map((item, index) => {
          return (
            <div key={index} className="comment">
              <img
                src={item.snippet.topLevelComment.snippet.authorProfileImageUrl}
                alt=""
              />
              <div>
                <h3>
                  {item.snippet.topLevelComment.snippet.authorDisplayName}{" "}
                  <span>
                    {moment(
                      item.snippet.topLevelComment.snippet.updatedAt
                    ).fromNow()}
                  </span>
                </h3>
                <p>{item.snippet.topLevelComment.snippet.textOriginal}</p>
                <div className="comment-action">
                  <img src={like} alt="" />
                  <span>
                    {value_converter(
                      item.snippet.topLevelComment.snippet.likeCount
                    )}
                  </span>
                  <img src={dislike} alt="" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayVideo;
