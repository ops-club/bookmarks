import yaml
import sys
import os
import glob

def sort_bookmarks_by_folder(yaml_file):
    with open(yaml_file, 'r') as file:
        data = yaml.safe_load(file)

    # Get the first level key dynamically
    first_level_key = list(data.keys())[0]
    
    # Update the folder values to be in lowercase
    for bookmark in data[first_level_key]['bookmarks']:
        bookmark['folder'] = bookmark['folder'].lower()

    # Sort bookmarks by the 'folder' key
    data[first_level_key]['bookmarks'].sort(key=lambda x: x['folder'])

    with open(yaml_file, 'w') as file:
        yaml.dump(data, file, default_flow_style=False, indent=2, sort_keys=False)

if __name__ == "__main__":
    yaml_folder = sys.argv[1]
    yaml_files = glob.glob(os.path.join(yaml_folder, '*.yml')) + glob.glob(os.path.join(yaml_folder, '*.yaml'))
    for yaml_file in yaml_files:
        sort_bookmarks_by_folder(yaml_file)
