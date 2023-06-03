// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract UserIdentity {
    struct UserProfile {
        string name;
        string bio;
        string[] links;
        string profileImageHash;
    }
    struct aproval {
        bool varr;
    }
    mapping(address => UserProfile) private profiles;
    mapping(address => aproval) private aprovals;
    event ProfileUpdated(address indexed user, string message);
    event ProfileAdded(address indexed user, string message);

    function updateName(string memory name) public {
        profiles[msg.sender].name = name;
        emit ProfileUpdated(msg.sender, "Name is updated");
    }

    function updateBio(string memory bio) public {
        profiles[msg.sender].bio = bio;
        emit ProfileUpdated(msg.sender, "Bio is updated");
    }

    function updateLinks(string[] memory links) public {
        profiles[msg.sender].links = links;
        emit ProfileUpdated(msg.sender, "links is updated");
    }

    function updateProfileImage(string memory profileImageHash) public {
        profiles[msg.sender].profileImageHash = profileImageHash;
        emit ProfileUpdated(msg.sender, "Image is updated");
    }

    function addProfile(
        string memory name,
        string memory bio,
        string[] memory links,
        string memory profileImageHash
    ) public {
        require(
            bytes(profiles[msg.sender].name).length == 0,
            "Profile already exists"
        );
        profiles[msg.sender] = UserProfile(name, bio, links, profileImageHash);
        emit ProfileAdded(msg.sender, "Profile is created Dont worry");
    }

    function getProfile()
        public
        view
        returns (string memory, string memory, string[] memory, string memory)
    {
        UserProfile memory userProfile = profiles[msg.sender];
        return (
            userProfile.name,
            userProfile.bio,
            userProfile.links,
            userProfile.profileImageHash
        );
    }

    function reverseaprovalforpublicuse() public {
        if (!aprovals[msg.sender].varr) {
            aprovals[msg.sender].varr = true;
        } else {
            aprovals[msg.sender].varr = false;
        }
    }

    function statusofapproval() public view returns (bool) {
        return aprovals[msg.sender].varr;
    }

    function getPublicProfile(
        address user
    )
        public
        view
        returns (string memory, string memory, string[] memory, string memory)
    {
        require(aprovals[user].varr, "the profile is not available publically");
        UserProfile memory userProfile = profiles[user];
        return (
            userProfile.name,
            userProfile.bio,
            userProfile.links,
            userProfile.profileImageHash
        );
    }
}
