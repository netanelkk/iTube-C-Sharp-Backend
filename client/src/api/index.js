import React from 'react';
import axios from 'axios';

// Token for registered users
const token = localStorage.getItem('token');

// Function to handle all requests
async function request(url, data, requestMethod="POST") {
  let resp; // for storing response copy
  let request = { method: requestMethod,
    headers: { "Content-Type": "application/json" }
  };

  if(requestMethod == "POST") {
    request.body = JSON.stringify(data);
  }

  // User signed in
  if(token != null) {
    request.headers["Authorization"] = 'Bearer '+token;
  }

    return await fetch(url, request).then((response) => {
      resp = response;
      return response.json();
    }).then((result) => { 
      if(!result) {
        throw new Error();
      }

      result.pass = true; // Indicates successive request (200 HTTP)
      if (!resp.ok) {
        result.pass = false; // Request failed 
      }
      return result; 

    }).catch((error) => {
      return { 
        pass: false, 
        msg: "Unexpected error, try again", 
        error: JSON.stringify(error) 
      };
    });
}

let API_URL = "http://localhost:55317/api"; // http://proj.ruppin.ac.il/cgroup7/test2/tar1/api

export async function login({ username, password }) {
  return await request(API_URL+"/auth/login", { username, password });
}

export async function register({ username, email, password }) {
  return await request(API_URL+"/auth/register", { username, email, password });
}

export async function fetchNewVideos() {
  return await request(API_URL+"/main/", "", "GET");
}

export async function fetchPopular() {
  return await request(API_URL+"/main/popular", "", "GET");
}

export async function watch(id, password) {
  return await request(API_URL+"/watch/"+id, {password});
}

export async function like(id) {
  return await request(API_URL+"/watch/like", {videoId: id});
}

export async function fetchComments(id, page) {
  return await request(API_URL+"/watch/"+id+"/comments/"+page, "", "GET");
}

export async function addComment(videoId, content) {
  return await request(API_URL+"/watch/"+videoId+"/comments", {content});
}

export async function fetchAlsoLike(id) {
  return await request(API_URL+"/watch/"+id+"/alsolike", "", "GET");
}

export async function search(query, page, orderby) {
  return await request(API_URL+"/search", {query, page, orderby});
}

export async function suggestion(query) {
  return await request(API_URL+"/search/suggestion", {query});
}

export async function fetchTrending() {
  return await request(API_URL+"/main/trending", "", "GET");
}

export async function userDetails(id) {
  return await request(API_URL+"/channel/"+id, "", "GET");
}

export async function uploadedVideos(id, page) {
  return await request(API_URL+"/channel/uploaded/"+id+"/"+page, "", "GET");
}

export async function subscribe(id) {
  return await request(API_URL+"/channel/subscribe", {subscribeTo: id});
}

export async function unsubscribe(id) {
  return await request(API_URL+"/channel/unsubscribe", {subscribeTo: id});
}

export async function mysubscriptions(page) {
  return await request(API_URL+"/channel/mysubscriptions/"+page, "", "GET");
}

export async function fetchSubscriptions() {
  return await request(API_URL+"/main/subscriptions", "", "GET");
}

export async function fetchHistory(page) {
  return await request(API_URL+"/main/history/"+page, "", "GET");
}

export async function fetchLikes(page) {
  return await request(API_URL+"/main/likes/"+page, "", "GET");
}

export async function mydetails() {
  return await request(API_URL+"/channel/mydetails", "", "GET");
}

export async function updatedetails({ email, newPassword, password }) {
  return await request(API_URL+"/channel/details", { email, newPassword, password });
}

export async function updatetitle({ videoId, title }) {
  return await request(API_URL+"/watch/updatetitle/"+videoId, { title });
}

export async function updateprivate({ videoId, password, privateChecked }) {
  return await request(API_URL+"/watch/updateprivate/"+videoId, { password, privateChecked });
}

export async function deletevideo({ videoId }) {
  return await request(API_URL+"/watch/delete", { videoId });
}

export async function deletecomment(commentId) {
  return await request(API_URL+"/watch/commentdelete", { commentId }); 
}

export async function userSearch(username) {
  return await request(API_URL+"/watch/usersearch/"+username, "", "GET");
}

export async function channelLiked(id, page) {
  return await request(API_URL+"/channel/liked/"+id+"/"+page, "", "GET");
}

export async function channelSubscriptions(id, page) {
  return await request(API_URL+"/channel/subscriptions/"+id+"/"+page, "", "GET");
}

export async function updateprofile(about) {
  return await request(API_URL+"/channel/updateprofile", {about});
}

export async function totalviews(userId) {
  return await request(API_URL+"/channel/totalviews/"+userId, "", "GET");
}



// Requests handling image/video uploading

async function fileRequest(path, formData, config) {
  axios.defaults.headers.common['Authorization'] = 'Bearer '+token;
  try {
    const res = await axios.post(API_URL + path, formData, config);
    res.pass = true;
    return res;
  } catch(ex) {
    return { 
      pass: false, 
      msg: ex.response.data 
    };
  }
}

export async function upload(path, data, config) {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    formData.append(key, data[key]);
  });
  return fileRequest(path, formData, config);
}

