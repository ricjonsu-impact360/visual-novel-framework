gitpush (){
    # Function: push commits via git
    git add --all
    git commit -m "$*"
    git push origin $GIT_BRANCH
}


exit_abnormal() {
    # Function: Exit with error.
    usage
    exit 1
}

# Options lists
optstring=":l:u:hbnag:cvp"

# No arguments given
if [ $# -eq 0 ]
then
    usage
fi

# Execute Prioritized Options
while getopts "$optstring" opt
do
   case $opt in
    u)
        update_version_number ${OPTARG}
        ;;
    l)
        LANGUAGE=${OPTARG}
        echo "language to use:" ${LANGUAGE}
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

# Execute other options
OPTIND=1 # Reset as getopts has been used previously in the shell.
while getopts "$optstring" opt
do
  case $opt in
    h)
        usage
      ;;
    
    b)
        
      ;;
    p)
        # preqa_checker
      ;;
    n)
        
      ;;
    a)
        
      ;;
    g)
        gitpush ${OPTARG}
      ;;
    c)
        
      ;;
    v)
        
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