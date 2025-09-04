export const Button = (props: {onClick: () => void}) => {
    const { onClick } = props;
    return (
        <div className="flex justify-end mt-1">
          <button 
            className="px-5 py-2 border-none bg-blue-600 text-white rounded cursor-pointer text-base font-bold hover:bg-blue-700"
            onClick={onClick}
          >
            逆算
          </button>
        </div>
    );
};