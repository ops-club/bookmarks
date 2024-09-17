
# Bookmarks Configuration Project

This project is designed to manage and configure bookmarks using YAML files. The main configuration file is `bookmarks-home.yaml`, located in the `bookmarks.d` directory. The project allows users to customize their bookmarks by specifying various properties, such as the title, URL, folder, tags, and more.

## Features

- **Customizable Folders**: Organize bookmarks into folders for better structure and access.
- **Tagging**: Use tags to categorize and quickly find bookmarks.
- **Automatic Title and Favicon Retrieval**: If the `title` or favicon is not specified, the system will automatically attempt to retrieve them from the page.
- **Pinning to Sidebar**: Option to pin specific bookmarks to the sidebar for easier access.

## Configuration Structure

The configuration file is written in YAML format. Below is an example configuration and its explanation.

### Example Configuration

```yaml
- favicon_proxy: false
  folder: tools
  pin: false
  tags:
    - tool
    - glossary
  title: Lexique
  url: https://acme.com
```

### Configuration Parameters

- **favicon_proxy**: (`true` or `false`) - Enables or disables using a proxy for fetching favicons.
- **folder**: Specifies the folder where the bookmark will be categorized.
- **pin**: (`true` or `false`) - When set to `true`, the bookmark is pinned to the sidebar for easy access.
- **tags**: A list of tags to categorize the bookmark.
- **title**: The title of the bookmark. If not specified, the system will attempt to retrieve it from the page.
- **url**: The URL of the bookmark.

## Behavior

- **Pinning Bookmarks**: When the `pin` property is set to `true`, the bookmark will appear pinned in the left-hand sidebar.
- **Automatic Title Retrieval**: If the `title` field is not present in the configuration, the system will automatically attempt to retrieve the title from the page specified by the URL.
- **Automatic Favicon Retrieval**: Similar to the title, if the favicon is not provided, the system will try to retrieve the page's favicon.

## Installation & Setup

1. Clone this repository to your local machine.
   ```bash
   git clone git@github.com:ops-club/bookmarks.git
   ```
2. Place your bookmark configurations in the `bookmarks.d` directory inside the `bookmarks-home.yaml` file.

3. Start the bookmark manager system as per the instructions of your application or platform.

## Building Static Pages

To build the static pages for the bookmarks, simply run the following command:

```bash
just build
```

The static HTML files will be generated and saved in the `output` directory. These files can be opened directly in a browser without needing a web server.

## Contribution

Feel free to contribute to this project by submitting issues or pull requests.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.
