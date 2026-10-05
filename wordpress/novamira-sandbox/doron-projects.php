<?php
/**
 * Doron Ben Arbon — "פרויקטים" custom post type.
 *
 * Every project is entered once in the dashboard (פרויקטים → הוסף חדש),
 * assigned to one or more "סוג פרויקט" terms, and Elementor Loop widgets
 * display it automatically in:
 *   - the home page gallery ("הכל" + the matching category tab)
 *   - the matching inner page (תיווך מסחרי / שיווק פרויקטים / מגרשים)
 *
 * Fields: title, excerpt (short description), featured image (card image),
 * order (Page Attributes → סדר), plus the meta box below.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const DORON_PROJECT_META = [
	'project_location'    => 'מיקום (מוצג עם אייקון סיכה)',
	'project_tag_1'       => 'תגית 1 (למשל: 550 מ״ר)',
	'project_tag_2'       => 'תגית 2 (למשל: שטח מסחרי)',
];

add_action( 'init', function () {
	register_post_type( 'project', [
		'labels'              => [
			'name'               => 'פרויקטים',
			'singular_name'      => 'פרויקט',
			'menu_name'          => 'פרויקטים',
			'add_new'            => 'הוספת פרויקט',
			'add_new_item'       => 'הוספת פרויקט חדש',
			'edit_item'          => 'עריכת פרויקט',
			'new_item'           => 'פרויקט חדש',
			'view_item'          => 'צפייה בפרויקט',
			'search_items'       => 'חיפוש פרויקטים',
			'not_found'          => 'לא נמצאו פרויקטים',
			'not_found_in_trash' => 'לא נמצאו פרויקטים בפח',
			'all_items'          => 'כל הפרויקטים',
			'featured_image'     => 'תמונת הפרויקט',
			'set_featured_image' => 'בחירת תמונת פרויקט',
		],
		'public'              => true,
		'publicly_queryable'  => false, // projects are shown inside pages, no standalone URL
		'exclude_from_search' => true,
		'has_archive'         => false,
		'show_in_rest'        => true,
		'menu_position'       => 5,
		'menu_icon'           => 'dashicons-building',
		'supports'            => [ 'title', 'excerpt', 'thumbnail', 'page-attributes', 'custom-fields' ],
		'rewrite'             => false,
	] );

	register_taxonomy( 'project_type', [ 'project' ], [
		'labels'            => [
			'name'          => 'סוגי פרויקטים',
			'singular_name' => 'סוג פרויקט',
			'menu_name'     => 'סוגי פרויקטים',
			'all_items'     => 'כל הסוגים',
			'edit_item'     => 'עריכת סוג',
			'add_new_item'  => 'הוספת סוג חדש',
		],
		'hierarchical'      => true, // checkbox UI in the editor
		'public'            => true,
		'publicly_queryable'=> false,
		'show_admin_column' => true,
		'show_in_rest'      => true,
		'rewrite'           => false,
	] );

	foreach ( array_merge( array_keys( DORON_PROJECT_META ), [ 'project_inner_image' ] ) as $key ) {
		register_post_meta( 'project', $key, [
			'type'          => 'project_inner_image' === $key ? 'integer' : 'string',
			'single'        => true,
			'show_in_rest'  => true,
			'auth_callback' => fn() => current_user_can( 'edit_posts' ),
		] );
	}
} );

// Classic editor for projects: a simple form (title, excerpt, image, fields).
add_filter( 'use_block_editor_for_post_type', fn( $use, $type ) => 'project' === $type ? false : $use, 10, 2 );

// Elementor must not take over project editing (cards are designed in Loop Item templates).
add_filter( 'elementor/utils/is_post_support', fn( $s, $id, $type ) => 'project' === $type ? false : $s, 10, 3 );

// Rename the excerpt box so it is clear what it is.
add_action( 'add_meta_boxes_project', function () {
	remove_meta_box( 'postexcerpt', 'project', 'normal' );
	add_meta_box( 'postexcerpt', 'תיאור קצר (מופיע בכרטיס)', 'post_excerpt_meta_box', 'project', 'normal', 'high' );
	remove_meta_box( 'postcustom', 'project', 'normal' );
	add_meta_box( 'doron_project_details', 'פרטי הפרויקט', 'doron_project_details_box', 'project', 'normal', 'high' );
} );

function doron_project_details_box( $post ) {
	wp_nonce_field( 'doron_project_details', 'doron_project_nonce' );
	echo '<table class="form-table" role="presentation">';
	foreach ( DORON_PROJECT_META as $key => $label ) {
		printf(
			'<tr><th><label for="%1$s">%2$s</label></th><td><input type="text" class="regular-text" id="%1$s" name="%1$s" value="%3$s"></td></tr>',
			esc_attr( $key ),
			esc_html( $label ),
			esc_attr( get_post_meta( $post->ID, $key, true ) )
		);
	}
	$img_id  = (int) get_post_meta( $post->ID, 'project_inner_image', true );
	$img_src = $img_id ? wp_get_attachment_image_url( $img_id, 'medium' ) : '';
	?>
	<tr>
		<th>תמונה לעמוד הקטגוריה (לא חובה)</th>
		<td>
			<input type="hidden" id="project_inner_image" name="project_inner_image" value="<?php echo esc_attr( $img_id ?: '' ); ?>">
			<img id="project_inner_image_preview" src="<?php echo esc_url( $img_src ); ?>" style="max-width:240px;display:<?php echo $img_src ? 'block' : 'none'; ?>;margin-bottom:8px;border-radius:8px">
			<button type="button" class="button" id="project_inner_image_pick">בחירת תמונה</button>
			<button type="button" class="button-link-delete" id="project_inner_image_clear" style="margin-inline-start:8px">הסרה</button>
			<p class="description">אם לא נבחרה – בעמוד הקטגוריה תוצג תמונת הפרויקט הראשית.</p>
		</td>
	</tr>
	</table>
	<script>
	jQuery(function ($) {
		var frame;
		$('#project_inner_image_pick').on('click', function (e) {
			e.preventDefault();
			frame = frame || wp.media({ title: 'תמונה לעמוד הקטגוריה', multiple: false, library: { type: 'image' } });
			frame.off('select').on('select', function () {
				var a = frame.state().get('selection').first().toJSON();
				$('#project_inner_image').val(a.id);
				$('#project_inner_image_preview').attr('src', (a.sizes && a.sizes.medium ? a.sizes.medium.url : a.url)).show();
			});
			frame.open();
		});
		$('#project_inner_image_clear').on('click', function () {
			$('#project_inner_image').val('');
			$('#project_inner_image_preview').hide();
		});
	});
	</script>
	<?php
}

add_action( 'admin_enqueue_scripts', function () {
	$screen = get_current_screen();
	if ( $screen && 'project' === $screen->post_type ) {
		wp_enqueue_media();
	}
} );

add_action( 'save_post_project', function ( $post_id ) {
	if ( ! isset( $_POST['doron_project_nonce'] ) || ! wp_verify_nonce( $_POST['doron_project_nonce'], 'doron_project_details' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE || ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}
	foreach ( array_keys( DORON_PROJECT_META ) as $key ) {
		update_post_meta( $post_id, $key, sanitize_text_field( wp_unslash( $_POST[ $key ] ?? '' ) ) );
	}
	$img = absint( $_POST['project_inner_image'] ?? 0 );
	$img ? update_post_meta( $post_id, 'project_inner_image', $img ) : delete_post_meta( $post_id, 'project_inner_image' );
} );

// Thumbnail column in the projects list.
add_filter( 'manage_project_posts_columns', function ( $cols ) {
	return array_merge( [ 'cb' => $cols['cb'], 'doron_thumb' => 'תמונה' ], $cols );
} );
add_action( 'manage_project_posts_custom_column', function ( $col, $post_id ) {
	if ( 'doron_thumb' === $col ) {
		echo get_the_post_thumbnail( $post_id, [ 60, 60 ], [ 'style' => 'border-radius:6px;object-fit:cover;width:60px;height:60px' ] );
	}
}, 10, 2 );

// Projects list ordered like the site (by "סדר", then newest).
add_action( 'pre_get_posts', function ( $q ) {
	if ( is_admin() && $q->is_main_query() && 'project' === $q->get( 'post_type' ) && ! $q->get( 'orderby' ) ) {
		$q->set( 'orderby', [ 'menu_order' => 'ASC', 'date' => 'DESC' ] );
	}
} );

/**
 * Elementor dynamic tag: "תמונת פרויקט לעמוד קטגוריה".
 * Returns the project's category-page image, falling back to the featured image.
 */
add_action( 'elementor/dynamic_tags/register', function ( $tags ) {
	if ( ! class_exists( '\Elementor\Core\DynamicTags\Data_Tag' ) ) {
		return;
	}
	if ( ! class_exists( 'Doron_Project_Inner_Image_Tag' ) ) {
		class Doron_Project_Inner_Image_Tag extends \Elementor\Core\DynamicTags\Data_Tag {
			public function get_name() { return 'doron-project-inner-image'; }
			public function get_title() { return 'תמונת פרויקט לעמוד קטגוריה'; }
			public function get_group() { return 'post'; }
			public function get_categories() { return [ \Elementor\Modules\DynamicTags\Module::IMAGE_CATEGORY ]; }
			public function get_value( array $options = [] ) {
				$id = (int) get_post_meta( get_the_ID(), 'project_inner_image', true );
				if ( ! $id ) {
					$id = (int) get_post_thumbnail_id();
				}
				return $id ? [ 'id' => $id, 'url' => wp_get_attachment_image_url( $id, 'full' ) ] : [];
			}
		}
	}
	$tags->register( new Doron_Project_Inner_Image_Tag() );
} );
