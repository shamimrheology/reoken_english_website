
#################################
research-institute-website/
├── index.html
├── about.html
├── research.html
├── collaborations.html
├── news.html
├── publications.html
├── contact.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── images/
│   ├── logo.png
│   ├── banner1.jpg
│   ├── banner2.jpg
│   ├── banner3.jpg
│   ├── research1.jpg
│   ├── research2.jpg
│   ├── research3.jpg
│   ├── lipidomics1.jpg
│   ├── lipidomics2.jpg
│   ├── lipidomics3.jpg
│   ├── neuroscience1.jpg
│   ├── neuroscience2.jpg
│   ├── neuroscience3.jpg
│   ├── therapeutic1.jpg
│   ├── therapeutic2.jpg
│   ├── therapeutic3.jpg
│   ├── plasmalogen1.jpg
│   ├── plasmalogen2.jpg
│   ├── plasmalogen3.jpg
│   ├── collaboration1.png
│   ├── collaboration2.png
│   ├── news1.jpg
│   ├── news2.jpg
│   ├── news3.jpg
│   └── ... (other images and assets)
├── software/
│   ├── genomics_tool.zip
│   ├── lipidomics_visualizer.zip
│   └── behavioral_tracking_ai.zip
├── publications/
│   ├── publication1.pdf
│   ├── publication2.pdf
│   └── publication3.pdf
└── videos/
    └── behavioral_neuroscience.mp4

#######################################################




#### Python script to convert avi file to mp4 file

pip install moviepy

convert_video.py
########################
from moviepy.editor import VideoFileClip

# Input and output file names
input_file = "d4_far1_mut_No23_roi_contour.avi"
output_file = "d4_far1_mut_No23_roi_contour.mp4"

try:
    # Load the video file
    video = VideoFileClip(input_file)
    
    # Write to mp4 file
    video.write_videofile(output_file, codec="libx264", audio_codec="aac")
    
    print(f"Conversion completed: {output_file}")
except Exception as e:
    print(f"An error occurred: {e}")

#########################################
















