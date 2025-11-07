# Options lists
optstring=":bt"



# Execute other options
OPTIND=1 # Reset as getopts has been used previously in the shell.
while getopts "$optstring" opt
do
  case $opt in
    # a)
    #     node script-editor.js "processScript" ../media/text/scripts/ ../media/text/translate/ ../media/text/
    #     # node script-editor.js "processSpriterData" ../media/text/scripts/ ../media/text/translate/ ../media/text/
    #   ;;
    b)
		    node script-editor.js "processScript" ../media/text/scripts/ ../media/text/translate/ ../media/text/
	  ;;
	  # s)
		 #    node script-editor.js "processSpriterData" ../media/text/scripts/ ../media/text/translate/ ../media/text/
	  # ;;
    t)
        node chatgpt-translate.js ../media/text/translate/ "Indonesia" "id"
    ;;
    :)
        echo "Error: -${OPTARG} requires an argument."
        exit_abnormal
      ;;
    \?)
        echo "Invalid option: -$OPTARG" >&2
        exit_abnormal
      ;;
  esac
done