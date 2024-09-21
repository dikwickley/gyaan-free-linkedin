/**
 * Extracts the profile username from a LinkedIn URL.
 * @param {string} url - The full LinkedIn URL.
 * @returns {string|null} The profile username or null if not found.
 */
function extractLinkedInUsername(url) {
  try {
    const parsedUrl = new URL(url);

    // Check if it's a LinkedIn URL
    if (!parsedUrl.hostname.includes('linkedin.com')) {
      return null;
    }

    // Remove any query parameters and hash
    const path = parsedUrl.pathname.split('?')[0].split('#')[0];

    // Split the path into segments
    const segments = path.split('/').filter((segment) => segment.length > 0);

    // Common LinkedIn URL patterns:
    // 1. /in/username
    // 2. /pub/username
    // 3. /profile/view?id=profileId (old format, not handled here)

    if (segments.length >= 2) {
      if (segments[0] === 'in' || segments[0] === 'pub') {
        return segments[1];
      }
    }

    // If we can't determine the username, return null
    return null;
  } catch (error) {
    console.error('Error parsing LinkedIn URL:', error);
    return null;
  }
}

function createBlockButton() {
  const blockButton = document.createElement('button');
  blockButton.id = 'block-button';
  blockButton.textContent = 'Block';
  blockButton.style.cssText = `
        background-color: #0a66c2;
        color: white;
        border: none;
        padding: 8px 16px;
        margin-top: 10px;
        border-radius: 24px;
        cursor: pointer;
        font-weight: bold;
      `;
  return blockButton
}

// Function to hide posts from blocked users
function hidePosts() {
  const posts = document.querySelectorAll('.feed-shared-update-v2');

  posts.forEach((post) => {
    const authorImageElement = post.querySelector(
      '.app-aware-link.update-components-actor__image.relative'
    );

    if (!authorImageElement) return;

    // Add a block button to the profile.

    const blockButton = createBlockButton()
    authorImageElement.parentElement.appendChild(blockButton)

    const linkedinProfileLink = authorImageElement.getAttribute('href');
    const linkedinUsername = extractLinkedInUsername(linkedinProfileLink);

    // Hide the posts if linkedinUsername in blackList

    console.log({ linkedinUsername });
  });
}

// Run the function when the page loads
hidePosts();

const feed = document.querySelector(
  '.scaffold-finite-scroll.scaffold-finite-scroll--finite'
);

// Use a MutationObserver to check for new posts
const observer = new MutationObserver(hidePosts);
observer.observe(feed, { childList: true, subtree: true });
