import React from 'react';
import Link from '../link';
import { TagIcon } from '../../icons';
import { LazyLoad } from '../lazy-load';
import { parseTime } from '@blog/client/libs/time';
import style from './item.style.module.scss';
import { uniqueId } from 'lodash';
import { Space } from 'antd';
import { TinyAreaConfig, TinyArea } from '@ant-design/plots';
import CustomButton from '../commonButton/customButton';

const ThumbImg = React.forwardRef((props, ref) => <img {...props} className={style.thumbImg} ref={ref as any} />);
ThumbImg.displayName = 'ThumbImg';

const Item = (props: any) => {
    const item = props.item;
    const data = [1, 1, ...item.dayReadings.map((item) => item.count), 1, 1];
    const config: TinyAreaConfig = {
        autoFit: true,
        data,
        smooth: false,
        line: {
            size: 2,
            color: '#c6e48b',
        },
        padding: [0, -20, 0, -20],
        areaStyle: {
            fill: 'transparent',
            shadowColor: 'transparent',
        },
        yAxis: {
            max: Math.max(28, Math.max(...data)),
        },
        tooltip: {
            showContent: false,
            showCrosshairs: false,
        },
    };
    const postDateTemplate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    function titleCase(str) {
        let words = str.toLowerCase().split(' ');

        for (var i = 0; i < words.length; i++) {
            var letters = words[i].split('');
            letters[0] = letters[0].toUpperCase();
            words[i] = letters.join('');
        }
        return words.join(' ');
    }
    titleCase("I'm a little tea pot");
    return (
        // <div className={style.item + ' loader'}>
        //     <div className={style.itemLeft}>
        //         <Link href={`/blog/articles/${item._id}`} passHref={true}>
        //             <a>
        //                 <h2>{item.title}</h2>
        //             </a>
        //         </Link>
        //         <div className={style.itemMeta}>
        //             <span className="cat">Đăng: {parseTime(item.createdAt)}</span>
        //             <em>·</em>
        //             <span className="cat">{(item.category && item.category.name) || '暂无分类'}</span> <em>·</em>
        //             <span>Lượt xem: {item.viewsCount}</span>
        //             <em>·</em>
        //             <span>Bình luận: {item.commentCount}</span>
        //         </div>
        //
        //         {item.tags.length > 0 && (
        //             <div className={style.tags}>
        //                 <TagIcon className={style.tagIcon}></TagIcon>
        //                 <Space>
        //                     {item.tags.map((name: any) => (
        //                         <Link href={`/blog/articles?tag=${name}`} passHref={true} key={uniqueId()}>
        //                             <a>{name}</a>
        //                         </Link>
        //                     ))}
        //                 </Space>
        //             </div>
        //         )}
        //     </div>
        //     <div className={style.itemRight}>
        //         <div className={style.thumbImgWrap}>
        //             <LazyLoad
        //                 component={ThumbImg}
        //                 attrs={{
        //                     style: { backgroundImage: `url(${item.screenshot})` },
        //                 }}
        //             ></LazyLoad>
        //         </div>
        //         <div title={item.title } style={{ height: '28px', width: '100%' }}>
        //             <TinyArea {...config} />
        //         </div>
        //     </div>
        // </div>

        <div className={style.articleWrap}>
            <Link href={`/blog/articles/${item._id}`} passHref={true}>
                <img src={item.screenshot} style={{ cursor: 'pointer' }}></img>
            </Link>

            <div className={style.categoryName}>
                <span className={style.textIn}>Tại </span>
                <span className={style.category}>{item.category.name.toUpperCase()}</span>
            </div>
            <Link href={`/blog/articles/${item._id}`} passHref={true}>
                <h2 className={style.title}>{titleCase(item.title)}</h2>
            </Link>

            <div className={style.createDate}>
                <span className={style.date}>
                    {new Date(item.createdAt).toLocaleDateString('vi', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                    <span> - </span>
                </span>
                <span className={style.comment}>{item.commentCount} Comment</span>
            </div>
            <p className={style.itemSummary}>{item.summary}</p>
            <Link href={`/blog/articles/${item._id}`} passHref={true}>
                <span>
                    <CustomButton>XEM THÊM </CustomButton>
                </span>
            </Link>
        </div>
    );
};

export default Item;
