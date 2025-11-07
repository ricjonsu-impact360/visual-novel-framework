# Options lists
languageCode=""
language=""
fileName=""
# No arguments given
if [ $# -eq 0 ]
then
    usage
fi

# Execute Prioritized Options
while getopts "at:" opt;
do
   case $opt in
    a)
        # IFS=',' read -r language languageCode <<< "$OPTARG"
        # echo "language to use:" ${language} "languageCode:" ${languageCode}
        # node chatgpt-translate.js  ${language} ${languageCode}
        node chatgpt-translate.js
        ;;
    t)
        # IFS=',' read -r language languageCode fileName<<< "$OPTARG"
        echo "file:" $OPTARG
        # echo "language to use:" ${language} "languageCode:" ${languageCode}
        # node chatgpt-translate.js ${language} ${languageCode} ${fileName}
        node chatgpt-translate.js $OPTARG
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