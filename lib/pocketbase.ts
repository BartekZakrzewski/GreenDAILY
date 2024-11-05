import PocketBase from "pocketbase";

const pb = new PocketBase("https://greendaily.pockethost.io");
pb.autoCancellation(false);

export default pb;
