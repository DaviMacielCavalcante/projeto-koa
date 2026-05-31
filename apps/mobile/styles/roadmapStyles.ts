import { Dimensions, StyleSheet } from 'react-native';
import { colors, fonts, sizes } from '../design/theme';

const SCREEN_W = Dimensions.get('window').width;
export const ROADMAP_PADDING_H = 24;
export const ROADMAP_CONTAINER_W = SCREEN_W - ROADMAP_PADDING_H * 2;
export const NODE_SIZE = 72;
export const SIDE_INSET = 8;
export const STEP_HEIGHT = 130;
export const LINE_THICKNESS = 5;

export const LEFT_CX = SIDE_INSET + NODE_SIZE / 2;
export const RIGHT_CX = ROADMAP_CONTAINER_W - SIDE_INSET - NODE_SIZE / 2;
export const HORIZ_DIST = RIGHT_CX - LEFT_CX;
export const DIAGONAL_LENGTH = Math.sqrt(
    STEP_HEIGHT * STEP_HEIGHT + HORIZ_DIST * HORIZ_DIST
);
export const ANGLE_FROM_VERTICAL_DEG =
    (Math.atan2(HORIZ_DIST, STEP_HEIGHT) * 180) / Math.PI;

export const roadmapStyles = StyleSheet.create({
    headerCardWrap: {
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 12,
        borderRadius: 22,
        shadowColor: colors.tealDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 10,
        elevation: 4,
    },
    headerCard: {
        borderRadius: 22,
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    headerTexto: {
        flex: 1,
    },
    headerTrofeu: {
        width: 72,
        height: 72,
    },
    titulo: {
        fontFamily: fonts.monoSemi,
        fontSize: sizes.xxl,
        color: colors.tealDark,
    },
    subtitulo: {
        fontFamily: fonts.mono,
        fontSize: sizes.bodySm,
        color: colors.inkMute,
        marginTop: 6,
    },
    tutorialBtnWrap: {
        paddingHorizontal: 24,
        paddingBottom: 8,
    },
    scrollContent: {
        paddingBottom: 60,
    },
    pathWallpaper: {
        width: '100%',
        alignItems: 'center',
    },
    pathWallpaperImage: {
        opacity: 0.7,
    },
    pathContainer: {
        width: ROADMAP_CONTAINER_W,
        alignSelf: 'center',
        paddingTop: 12,
        paddingBottom: 24,
    },
    chapterHeader: {
        alignSelf: 'center',
        marginTop: 8,
        marginBottom: 18,
        paddingHorizontal: 20,
        paddingVertical: 8,
        backgroundColor: colors.tealDark,
        borderRadius: 20,
    },
    chapterHeaderText: {
        fontFamily: fonts.monoSemi,
        fontSize: sizes.body,
        color: colors.white,
        letterSpacing: 1,
    },
    step: {
        height: STEP_HEIGHT,
        position: 'relative',
        overflow: 'visible',
    },
    nodeAnchor: {
        position: 'absolute',
        top: 0,
        width: NODE_SIZE,
        alignItems: 'center',
    },
    nodeAnchorLeft: {
        left: SIDE_INSET,
    },
    nodeAnchorRight: {
        right: SIDE_INSET,
    },
    nodeCircle: {
        width: NODE_SIZE,
        height: NODE_SIZE,
        borderRadius: NODE_SIZE / 2,
        backgroundColor: colors.white,
        borderWidth: 3,
        borderColor: colors.creamDeep,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.tealDark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 2,
    },
    nodeCircleRead: {
        backgroundColor: colors.tealMid,
        borderColor: colors.tealDark,
    },
    nodeTitleWrap: {
        marginTop: 8,
        maxWidth: NODE_SIZE + 50,
        backgroundColor: 'rgba(255, 254, 247, 0.55)',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    nodeTitle: {
        fontFamily: fonts.monoSemi,
        fontSize: 13,
        color: colors.tealDark,
        textAlign: 'center',
        width: NODE_SIZE + 30,
    },
    nodeTitleRead: {
        color: colors.statusGreen,
    },
    connector: {
        position: 'absolute',
        top: NODE_SIZE / 2,
        width: LINE_THICKNESS,
        height: DIAGONAL_LENGTH,
        borderRadius: LINE_THICKNESS / 2,
        backgroundColor: colors.creamDeep,
        transformOrigin: 'top',
    },
    connectorRead: {
        backgroundColor: colors.statusGreen,
    },
    connectorFromLeft: {
        left: LEFT_CX - LINE_THICKNESS / 2,
        transform: [{ rotate: `-${ANGLE_FROM_VERTICAL_DEG}deg` }],
    },
    connectorFromRight: {
        left: RIGHT_CX - LINE_THICKNESS / 2,
        transform: [{ rotate: `${ANGLE_FROM_VERTICAL_DEG}deg` }],
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        paddingHorizontal: 32,
    },
    emptyText: {
        fontFamily: fonts.body,
        fontSize: sizes.body,
        color: colors.inkMute,
        textAlign: 'center',
        marginTop: 12,
    },
});
