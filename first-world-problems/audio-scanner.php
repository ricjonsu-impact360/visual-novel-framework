<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Audio file extensions to look for
$audioExtensions = ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac', 'wma'];

// Base path to the audio directories
$basePath = '../v2-visual-novel-assets/audio';

function scanAudioDirectory($directory, $audioExtensions) {
    $files = [];
    $groupedFiles = [];
    
    if (!is_dir($directory)) {
        return $files;
    }
    
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($directory, RecursiveDirectoryIterator::SKIP_DOTS)
    );
    
    // First pass: collect all files and group by base name
    foreach ($iterator as $file) {
        if ($file->isFile()) {
            $extension = strtolower($file->getExtension());
            if (in_array($extension, $audioExtensions)) {
                $relativePath = str_replace('\\', '/', $file->getPathname());
                $filename = $file->getFilename();
                $baseName = pathinfo($filename, PATHINFO_FILENAME);
                
                // Create display name by formatting base name
                $displayName = str_replace(['_', '-'], ' ', $baseName);
                $displayName = ucwords($displayName);
                
                $fileInfo = [
                    'name' => $filename,
                    'path' => $relativePath,
                    'displayName' => $displayName,
                    'size' => $file->getSize(),
                    'modified' => $file->getMTime(),
                    'extension' => $extension,
                    'baseName' => $baseName
                ];
                
                // Group files by base name
                if (!isset($groupedFiles[$baseName])) {
                    $groupedFiles[$baseName] = [];
                }
                $groupedFiles[$baseName][] = $fileInfo;
            }
        }
    }
    
    // Second pass: select best format for each group
    $preferredFormats = ['mp3', 'ogg', 'wav', 'm4a', 'aac', 'flac', 'wma'];
    
    foreach ($groupedFiles as $baseName => $fileGroup) {
        $selectedFile = null;
        
        // If only one file in group, use it
        if (count($fileGroup) === 1) {
            $selectedFile = $fileGroup[0];
        } else {
            // Multiple files - prefer mp3, then ogg, then others
            foreach ($preferredFormats as $preferredExt) {
                foreach ($fileGroup as $file) {
                    if ($file['extension'] === $preferredExt) {
                        $selectedFile = $file;
                        break 2;
                    }
                }
            }
            
            // If no preferred format found, use the first one
            if (!$selectedFile) {
                $selectedFile = $fileGroup[0];
            }
            
            // Add alternative formats info
            $alternatives = [];
            foreach ($fileGroup as $file) {
                if ($file['extension'] !== $selectedFile['extension']) {
                    $alternatives[] = [
                        'extension' => $file['extension'],
                        'path' => $file['path'],
                        'size' => $file['size']
                    ];
                }
            }
            $selectedFile['alternatives'] = $alternatives;
        }
        
        // Remove internal fields before adding to final array
        unset($selectedFile['extension'], $selectedFile['baseName']);
        $files[] = $selectedFile;
    }
    
    // Sort files by display name
    usort($files, function($a, $b) {
        return strcasecmp($a['displayName'], $b['displayName']);
    });
    
    return $files;
}

try {
    $response = [
        'success' => true,
        'bgm' => [],
        'sfx' => [],
        'timestamp' => time()
    ];
    
    // Scan BGM directory
    $bgmPath = $basePath . '/bgm';
    if (is_dir($bgmPath)) {
        $response['bgm'] = scanAudioDirectory($bgmPath, $audioExtensions);
    }
    
    // Scan SFX directory
    $sfxPath = $basePath . '/sfx';
    if (is_dir($sfxPath)) {
        $response['sfx'] = scanAudioDirectory($sfxPath, $audioExtensions);
    }
    
    // Add summary information
    $response['summary'] = [
        'bgm_count' => count($response['bgm']),
        'sfx_count' => count($response['sfx']),
        'total_count' => count($response['bgm']) + count($response['sfx'])
    ];
    
    echo json_encode($response, JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'timestamp' => time()
    ]);
}
?>