const listMembers = (guild) => {
  const memberList = [];
  guild.members.cache.forEach((m) => {
    if (m.user.bot) {
      return;
    }
    memberList.push({ uid: m.user.id, username: m.user.username });
  });
  return memberList;
};

module.exports = { listMembers };
