module.exports = {
  // protocol
  auth: 'async',

  // output streams
  createFeedStream: 'source',
  createHistoryStream: 'source',
  createLogStream: 'source',
  messagesByType: 'source',
  messagesLinkedToMessage: 'source',
  messagesLinkedToFeed: 'source',
  messagesLinkedFromFeed: 'source',
  feedsLinkedToFeed: 'source',
  feedsLinkedFromFeed: 'source',
  followedUsers: 'source',

  // getters
  get: 'async',
  getPublicKey: 'async',
  getLatest: 'async',
  whoami: 'async',
  getLocal: 'async',

  // publishers
  add: 'async',

  // plugins
  invite: {
    addMe: 'async'
  },
  gossip: {
    peers: 'sync',
    connect: 'async'
  },
  friends: {
    all: 'sync',
    hops: 'sync'
  },
  blobs: {
    get: 'source',
    has: 'async',
    add: 'sink',
    ls: 'source',
    want: 'async'
  },
  phoenix: {
    events: 'source',

    getFeed: 'async',

    getPosts: 'async',
    getPostsBy: 'async',
    getPostCount: 'async',

    getInbox: 'async',
    getInboxCount: 'async',

    getAdverts: 'async',
    getAdvertCount: 'async',
    getRandomAdverts: 'async',

    getMsg: 'async',
    getReplies: 'async',
    getPostParent: 'async',
    getThread: 'async',
    getThreadMeta: 'async',
    getAllThreadMetas: 'async',

    getMyProfile: 'async',
    getProfile: 'async',
    getAllProfiles: 'async',

    getNamesById: 'async',
    getNameTrustRanks: 'async',
    getName: 'async',
    getIdsByName: 'async'
  }
}