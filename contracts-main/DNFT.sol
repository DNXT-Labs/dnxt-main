// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./token/ERC721/ERC721.sol";
import "./token/ERC721/extensions/ERC721Enumerable.sol";
import "./token/ERC721/extensions/ERC721URIStorage.sol";
import "./security/Pausable.sol";
import "./access/Ownable.sol";
import "./access/AccessControl.sol";
import "./token/ERC721/extensions/ERC721Burnable.sol";
import "./utils/Counters.sol";
import "./Compliance.sol";
import "./token/common/ERC2981.sol";

contract DNFT is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    Pausable,
    Ownable,
    AccessControl,
    ERC721Burnable,
    Compliance,
    ERC2981
{
    using Counters for Counters.Counter;
    using Strings for uint256;

    // File extension for metadata file
    string public extension;
    string public baseURI;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant ROYALTIES_ROLE = keccak256("ROYALTIES_ROLE");
    bytes32 public constant ATTRIBUTE_ROLE = keccak256("ATTRIBUTE_ROLE");

    Counters.Counter public _tokenIdCounter;

    struct Certificate {
        string issuer;
        string number;
    }

    struct Diamond {
        string cut;
        string clarity;
        string color;
        uint256 caratWeight;
        string shape;
        string symmetry;
        string fluorescence;
        string polish;
        Certificate[] certificates;
    }

    mapping(uint256 => Diamond) private diamonds;
    mapping(uint256 => bool) private locked;

    event DefaultRoyaltySet(address indexed receiver, uint96 feeNumerator);
    event TokenRoyaltySet(
        uint256 indexed tokenId,
        address indexed receiver,
        uint96 feeNumerator
    );

    event Locked(uint256 tokenId);
    event Unlocked(uint256 tokenId);

    constructor(IComplianceRegistry _complianceRegistry)
        ERC721("Diamond NFT", "DNFT")
        Compliance(_complianceRegistry)
    {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender);
        _grantRole(ROYALTIES_ROLE, msg.sender);
        _grantRole(ATTRIBUTE_ROLE, msg.sender);
        setDefaultRoyalty(msg.sender, 1000);
        baseURI = "https://dnxt.app/json/";
        extension = ".json";
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    /**
     * @dev Allows an admin to change the base URI.
     * @param newBaseURI The new base URI to be set.
     */

    function setBaseURI(string memory newBaseURI)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        baseURI = newBaseURI;
    }

    /**
     * @dev Allows an admin to change the extension of the URI.
     * @param _extension The new extension to be set.
     */

    function setExtension(string memory _extension)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        extension = _extension;
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function lock(uint256 tokenId) public onlyRole(PAUSER_ROLE) {
        require(_exists(tokenId), "Token ID does not exist");
        locked[tokenId] = true;
        emit Locked(tokenId);
    }

    function unlock(uint256 tokenId) public onlyRole(PAUSER_ROLE) {
        require(_exists(tokenId), "Token ID does not exist");
        locked[tokenId] = false;
        emit Unlocked(tokenId);
    }

    /**
     * @dev Mints a new token and sets the diamond information.
     * @param to The address to mint the token to.
     * @param cut The cut grade of the diamond.
     * @param clarity The clarity grade of the diamond.
     * @param color The color grade of the diamond.
     * @param caratWeight The weight of the diamond in carats.
     * @param shape The shape of the diamond.
     * @param symmetry The symmetry grade of the diamond.
     * @param fluorescence The fluorescence grade of the diamond.
     * @param polish The polish grade of the diamond.
     * @param certs Array of Certificate structs.
     */
    function safeMintWithDiamondInfo(
        address to,
        string memory cut,
        string memory clarity,
        string memory color,
        uint256 caratWeight,
        string memory shape,
        string memory symmetry,
        string memory fluorescence,
        string memory polish,
        Certificate[] memory certs
    ) public onlyRole(MINTER_ROLE) {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(to, tokenId);

        setDiamondAttributes(
            tokenId,
            cut,
            clarity,
            color,
            caratWeight,
            shape,
            symmetry,
            fluorescence,
            polish,
            certs
        );
    }

    /**
     * @dev Sets the diamond attributes for a specific token ID.
     * @param tokenId The token ID to set the attributes for.
     * @param cut The cut grade of the diamond.
     * @param clarity The clarity grade of the diamond.
     * @param color The color grade of the diamond.
     * @param caratWeight The weight of the diamond in carats.
     * @param shape The shape of the diamond.
     * @param symmetry The symmetry grade of the diamond.
     * @param fluorescence The fluorescence grade of the diamond.
     * @param polish The polish grade of the diamond.
     * @param certs Array of Certificate structs.
     */
    function setDiamondAttributes(
        uint256 tokenId,
        string memory cut,
        string memory clarity,
        string memory color,
        uint256 caratWeight,
        string memory shape,
        string memory symmetry,
        string memory fluorescence,
        string memory polish,
        Certificate[] memory certs
    ) public onlyRole(ATTRIBUTE_ROLE) {
        require(_exists(tokenId), "Setting attributes for nonexistent token");
        Diamond storage diamond = diamonds[tokenId];
        diamond.cut = cut;
        diamond.clarity = clarity;
        diamond.color = color;
        diamond.caratWeight = caratWeight;
        diamond.shape = shape;
        diamond.symmetry = symmetry;
        diamond.fluorescence = fluorescence;
        diamond.polish = polish;
        for (uint256 i = 0; i < certs.length; i++) {
            diamond.certificates.push(certs[i]);
        }
    }

    function safeMint(address to) public onlyRole(MINTER_ROLE) {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(to, tokenId);
    }

    /**
     * @dev Mint multiple accounts at once by passing an array of addresses.
     * @param users The array of addresses to mint to.
     */
    function batchMint(address[] memory users) public onlyRole(MINTER_ROLE) {
        uint8 i = 0;
        for (i; i < users.length; i++) {
            safeMint(users[i]);
        }
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        require(!locked[tokenId], "Token ID is locked");
        compliantERC721Transfer(from, to, tokenId, address(this));
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    // The following functions are overrides required by Solidity.

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721) {
        super._afterTokenTransfer(from, to, tokenId, batchSize);
    }

    /**
     * @dev See {ERC721-_burn}. This override additionally clears the royalty information for the token.
     */
    function _burn(uint256 tokenId)
        internal
        virtual
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
        _resetTokenRoyalty(tokenId);
    }

    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory base = _baseURI();
        string memory id = tokenId.toString();

        return
            bytes(base).length > 0
                ? string(abi.encodePacked(base, id, extension))
                : "";
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC2981, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function setDefaultRoyalty(address receiver, uint96 feeNumerator)
        public
        onlyRole(ROYALTIES_ROLE)
    {
        _setDefaultRoyalty(receiver, feeNumerator);
        emit DefaultRoyaltySet(receiver, feeNumerator);
    }

    function setTokenRoyalty(
        uint256 tokenId,
        address receiver,
        uint96 feeNumerator
    ) public onlyRole(ROYALTIES_ROLE) {
        _setTokenRoyalty(tokenId, receiver, feeNumerator);
        emit TokenRoyaltySet(tokenId, receiver, feeNumerator);
    }

    function getCertificatesForDiamond(uint256 tokenId)
        public
        view
        returns (Certificate[] memory)
    {
        return diamonds[tokenId].certificates;
    }

    function addCertificateToDiamond(
        uint256 tokenId,
        string memory issuer,
        string memory number
    ) public onlyRole(ATTRIBUTE_ROLE) {
        Certificate memory newCert = Certificate({
            issuer: issuer,
            number: number
        });
        diamonds[tokenId].certificates.push(newCert);
    }

    function getDiamond(uint256 tokenId) public view returns (Diamond memory) {
        require(_exists(tokenId), "Token ID does not exist");
        return diamonds[tokenId];
    }

}
