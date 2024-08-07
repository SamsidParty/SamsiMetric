<?php

/* https://stackoverflow.com/a/34494243 */

/*
 * Converts a filesystem tree to a PHP array.
 */
function dir_to_array($dir)
{
        if (! is_dir($dir)) {
                // If the user supplies a wrong path we inform him.
                return null;
        }

        // Our PHP representation of the filesystem
        // for the supplied directory and its descendant.
        $data = [];

        foreach (new DirectoryIterator($dir) as $f) {
            if ($f->isDot()) {
                    // Dot files like '.' and '..' must be skipped.
                    continue;
            }

            $path = $f->getPathname();
            $name = $f->getFilename();

            if ($f->isFile()) {
                    $data[] = [ 'file' => $name, 'id' => "#" . crc32($path), 'path' => str_replace("./", "", $path) ];
            } else {
                    // Process the content of the directory.
                    $files = dir_to_array($path);

                    $data[] = [ 'dir'  => $files,
                                'name' => $name, 'id' => "#" . crc32($path) ];
                    // A directory has a 'name' attribute
                    // to be able to retrieve its name.
                    // In case it is not needed, just delete it.
            }
        }

        // Sorts files and directories if they are not on your system.
        \usort($data, function($a, $b) {
                $aa = isset($a['file']) ? $a['file'] : $a['name'];
                $bb = isset($b['file']) ? $b['file'] : $b['name'];

                return \strcmp($aa, $bb);
        });

        return $data;
}

/*
 * Converts a filesystem tree to a JSON representation.
 */
function dir_to_json($dir)
{
        $data = dir_to_array($dir);
        $data = json_encode($data);

        return $data;
}

header('Content-Type: application/json');
$map = dir_to_json('./');
echo $map;
file_put_contents("./docmap.json", $map);

?>